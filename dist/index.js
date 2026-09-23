// src/errors.ts
var PacketExchangeError = class _PacketExchangeError extends Error {
  /** Symbolic error code from the API envelope (e.g. `RATE_LIMITED`), or a
   *  synthetic one (`HTTP_500`, `NETWORK_ERROR`) when the body had none. */
  code;
  /** HTTP status code (0 for a transport/network failure before a response). */
  status;
  /**
   * Structured detail payload. For `VALIDATION_ERROR` this is an array of
   * `{ path, message }` (one per failing field); a few codes attach an object.
   */
  details;
  /**
   * The `X-Request-Id` response header (a UUID), when the API answered. Quote it to
   * support: it matches the server log and audit entry for this exact request.
   * Undefined for transport failures, where no response arrived.
   */
  requestId;
  constructor(args) {
    super(args.message);
    this.name = "PacketExchangeError";
    this.code = args.code;
    this.status = args.status;
    this.details = args.details;
    this.requestId = args.requestId;
    Object.setPrototypeOf(this, _PacketExchangeError.prototype);
  }
  /** Convenience: true for 401/403 (bad, missing, or under-scoped credential). */
  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }
  /** Convenience: true for HTTP 429 (slow down and retry). */
  get isRateLimited() {
    return this.status === 429;
  }
};

// src/http.ts
var DEFAULT_BASE_URL = "https://packetexchange.io/api/v1";
var HttpClient = class {
  baseUrl;
  apiKey;
  accessToken;
  fetchImpl;
  baseHeaders;
  constructor(opts) {
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.apiKey = opts.apiKey;
    this.accessToken = opts.accessToken;
    this.baseHeaders = opts.headers ?? {};
    const f = opts.fetch ?? globalThis.fetch;
    if (!f) {
      throw new Error(
        "No global `fetch` found. Pass `fetch` in the constructor or run on Node 18+, Bun, Deno, or a browser."
      );
    }
    this.fetchImpl = opts.fetch ? f : f.bind(globalThis);
  }
  /** Build the Authorization header from whichever credential was supplied. */
  authHeader() {
    const cred = this.apiKey ?? this.accessToken;
    return cred ? { Authorization: `Bearer ${cred}` } : {};
  }
  /** Serialise a query object into a `?a=1&b=2` string (drops null/undefined). */
  buildQuery(query) {
    if (!query) return "";
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === void 0 || v === null) continue;
      if (Array.isArray(v)) {
        for (const item of v) sp.append(k, String(item));
      } else {
        sp.set(k, String(v));
      }
    }
    const s = sp.toString();
    return s ? `?${s}` : "";
  }
  /**
   * Core request method. Returns the unwrapped `data` on success and throws a
   * `PacketExchangeError` on a non-2xx response OR a `success:false` envelope.
   */
  async request(method, path, opts = {}) {
    const env = await this.raw(method, path, opts);
    return env.data;
  }
  /**
   * Perform a request and return the raw `Response` WITHOUT envelope parsing.
   * For endpoints that stream non-JSON payloads (e.g. CSV exports). Throws a
   * `PacketExchangeError` on a non-2xx status (best-effort body parse).
   */
  async requestRaw(method, path, opts = {}) {
    const res = await this.send(method, path, opts, {});
    if (!res.ok) {
      let envelope;
      try {
        envelope = await res.clone().json();
      } catch {
      }
      throw this.errorFrom(res, envelope?.error);
    }
    return res;
  }
  /**
   * Like `request`, but returns the FULL envelope - used by paginated list
   * helpers that need `nextCursor`/`hasMore`/`total` alongside `data`.
   */
  async raw(method, path, opts = {}) {
    const res = await this.send(method, path, opts, { Accept: "application/json" });
    let parsed;
    const text = await res.text();
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { success: false, error: { code: `HTTP_${res.status}`, message: text || res.statusText } };
    }
    const env = parsed;
    if (!res.ok || env.success === false) throw this.errorFrom(res, env.error);
    return env;
  }
  /** Send one request with auth and JSON headers. Transport failures become `NETWORK_ERROR`. */
  async send(method, path, opts, defaultHeaders) {
    const url = `${this.baseUrl}${path}${this.buildQuery(opts.query)}`;
    const headers = {
      ...defaultHeaders,
      ...this.baseHeaders,
      ...this.authHeader(),
      ...opts.headers ?? {}
    };
    if (opts.idempotencyKey) headers["X-Idempotency-Key"] = opts.idempotencyKey;
    if (opts.body !== void 0) headers["Content-Type"] = "application/json";
    try {
      return await this.fetchImpl(url, {
        method,
        headers,
        body: opts.body !== void 0 ? JSON.stringify(opts.body) : void 0,
        signal: opts.signal
      });
    } catch (err) {
      throw new PacketExchangeError({
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Network request failed",
        status: 0,
        details: err
      });
    }
  }
  /** Build the typed error for a failed response from its envelope `error`, when it has one. */
  errorFrom(res, apiErr) {
    return new PacketExchangeError({
      code: apiErr?.code ?? `HTTP_${res.status}`,
      message: apiErr?.message ?? (res.statusText || "Request failed"),
      status: res.status,
      details: apiErr?.details,
      requestId: res.headers.get("x-request-id") ?? void 0
    });
  }
  /**
   * Return one page of a cursor-paginated endpoint as `{ data, nextCursor,
   * hasMore, total }`. Resource methods wrap this so list calls are uniform.
   */
  async page(path, opts = {}) {
    const env = await this.raw("GET", path, opts);
    return {
      data: env.data ?? [],
      nextCursor: env.nextCursor ?? null,
      hasMore: env.hasMore ?? false,
      total: env.total
    };
  }
  /**
   * Async-iterate every item across all pages of a cursor-paginated endpoint,
   * transparently following `nextCursor`. The cursor is passed as `?cursor=`.
   *
   *   for await (const tx of sdk.billing.transactionsAll()) { ... }
   */
  async *paginate(path, opts = {}) {
    let cursor = opts.query?.cursor ?? null;
    do {
      const env = await this.raw("GET", path, {
        ...opts,
        query: { ...opts.query, cursor: cursor ?? void 0 }
      });
      const items = env.data ?? [];
      for (const item of items) yield item;
      cursor = env.hasMore ? env.nextCursor ?? null : null;
    } while (cursor);
  }
};

// src/resources/routes.ts
var RoutesResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /routes - public marketplace listing. Returns `{ data, total }`. */
  list(filters = {}, opts) {
    return this.http.page("/routes", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /** Async-iterate every route across all pages of the marketplace listing. */
  listAll(filters = {}, opts) {
    return this.http.paginate("/routes", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /** GET /routes/:id - route details (public for live routes). */
  get(id, opts) {
    return this.http.request("GET", `/routes/${encodeURIComponent(id)}`, opts);
  }
  /** GET /routes/resolve - which route(s) Smart Routing would pick for a number. */
  resolve(params, opts) {
    return this.http.request("GET", "/routes/resolve", { ...opts, query: { ...params, ...opts?.query } });
  }
  /**
   * GET /routes/price-number - every marketplace route that serves `number`, at the rate
   * it would actually charge for it (longest-prefix rate-sheet row, or the flat price),
   * cheapest first. Public list prices; at most 100 routes (`total` counts all).
   */
  priceNumber(params, opts) {
    return this.http.request("GET", "/routes/price-number", { ...opts, query: { ...params, ...opts?.query } });
  }
  /** GET /routes/countries - distinct destination countries across the market. */
  countries(opts) {
    return this.http.request(
      "GET",
      "/routes/countries",
      opts
    );
  }
  /** GET /routes/stats - KPI aggregates over the full filtered set. */
  stats(filters = {}, opts) {
    return this.http.request("GET", "/routes/stats", {
      ...opts,
      query: { ...filters, ...opts?.query }
    });
  }
  /** GET /routes/my/list - the caller's own routes (cursor-paginated). */
  myList(params = {}, opts) {
    return this.http.page("/routes/my/list", { ...opts, query: { ...params, ...opts?.query } });
  }
  /** GET /routes/:id/price-history - price-change log (owner/buyer only). */
  priceHistory(id, opts) {
    return this.http.request(
      "GET",
      `/routes/${encodeURIComponent(id)}/price-history`,
      opts
    );
  }
  /** GET /routes/:id/stats - owner-only operational stats for one route. */
  ownerStats(id, opts) {
    return this.http.request("GET", `/routes/${encodeURIComponent(id)}/stats`, opts);
  }
  /** POST /routes - create a route (sellers). */
  create(input, opts) {
    return this.http.request("POST", "/routes", { ...opts, body: input });
  }
  /** PUT /routes/:id - update a route the caller owns. */
  update(id, input, opts) {
    return this.http.request("PUT", `/routes/${encodeURIComponent(id)}`, { ...opts, body: input });
  }
  /** DELETE /routes/:id - delete a route the caller owns. */
  delete(id, opts) {
    return this.http.request("DELETE", `/routes/${encodeURIComponent(id)}`, opts);
  }
};

// src/resources/comms.ts
var FINAL_CALL_STATUSES = ["completed", "no_answer", "busy", "failed"];
var CommsResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * POST /comms/calls - place a single outbound call (scope: voice:send). Waits for the
   * call to end and resolves with its outcome and cost. To return as soon as the call
   * is dialled, use `callAsync`.
   */
  call(params, opts) {
    return this.http.request("POST", "/comms/calls", {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey
    });
  }
  /**
   * POST /comms/calls with `async: true` (scope: voice:send). Resolves as soon as the
   * call is being dialled, with its `callId` (HTTP 202). Follow the call with `getCall`,
   * `waitForCall` or the call.ringing, call.answered, call.gathered and call.completed
   * webhooks. A call that ends before it is dialled (a test-key simulation, for
   * example) resolves with the final `CallResult` instead.
   *
   * @example
   * const call = await px.comms.callAsync({
   *   to: '+447700900123',
   *   from: '+14155550100',
   *   actions: [
   *     { say: 'Your appointment is tomorrow at 10am. Press 1 to confirm or 2 to cancel.' },
   *     { gather: { digits: 1, timeout: 5 } },
   *   ],
   * });
   */
  callAsync(params, opts) {
    return this.http.request("POST", "/comms/calls", {
      ...opts,
      body: { ...params, async: true },
      idempotencyKey: opts?.idempotencyKey
    });
  }
  /**
   * GET /comms/calls/:id - live status, timestamps, cost, hangup reason and gathered
   * digits for one call (scope: voice:send). Gathered digits are filled in when the
   * call ends.
   */
  getCall(callId, opts) {
    return this.http.request("GET", `/comms/calls/${encodeURIComponent(callId)}`, opts);
  }
  /**
   * Poll `getCall` until the call reaches a final state (see `FINAL_CALL_STATUSES`) or
   * `timeoutMs` passes (default 10 minutes), then resolve with the last status read.
   * Polls every `intervalMs` (default 2000, minimum 1000). For production services the
   * call webhooks avoid polling altogether.
   */
  async waitForCall(callId, options = {}, opts) {
    const deadline = Date.now() + (options.timeoutMs ?? 10 * 6e4);
    const interval = Math.max(1e3, options.intervalMs ?? 2e3);
    for (; ; ) {
      const status = await this.getCall(callId, opts);
      const done = FINAL_CALL_STATUSES.includes(status.status);
      if (done || Date.now() + interval > deadline) return status;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  /** POST /comms/sms - send a single SMS (scope: sms:send). */
  sms(params, opts) {
    const { body, ...rest } = params;
    return this.http.request("POST", "/comms/sms", {
      ...opts,
      // The API expects `message`, the SDK exposes the friendlier `body`.
      body: { ...rest, message: body },
      idempotencyKey: opts?.idempotencyKey
    });
  }
  /** POST /comms/sms/bulk - batch SMS over one route (scope: sms:send). */
  smsBulk(params, opts) {
    return this.http.request("POST", "/comms/sms/bulk", {
      ...opts,
      // Map each item's `body` → `message` to match the API schema.
      body: {
        routeId: params.routeId,
        from: params.from,
        messages: params.messages.map((m) => ({ to: m.to, message: m.body }))
      }
    });
  }
  /** GET /comms/calls - paginated call history. */
  listCalls(filters = {}, opts) {
    return this.http.page("/comms/calls", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /** GET /comms/sms - paginated SMS history. */
  listSms(filters = {}, opts) {
    return this.http.page("/comms/sms", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /**
   * POST /comms/voice-otp - call a number and speak a one-time passcode (scope: voice:send).
   * Returns once the call is dialled, not when it ends. Billed like any API call
   * (route rate plus platform fee). A test key simulates it: nothing is dialled.
   * For a full send-and-check flow prefer `verify.start({ channel: 'voice' })`, which
   * also stores the code (hashed) and checks it for you.
   */
  voiceOtp(params, opts) {
    return this.http.request("POST", "/comms/voice-otp", {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey
    });
  }
  /** GET /comms/voice-otp/:id - outcome and cost of a voice passcode call (scope: voice:send). */
  getVoiceOtp(voiceOtpId, opts) {
    return this.http.request("GET", `/comms/voice-otp/${encodeURIComponent(voiceOtpId)}`, opts);
  }
  /**
   * GET /comms/sms/:messageId - delivery status and timeline for one message.
   *
   * `timeline` runs queued, sent, then delivered or failed, with a timestamp per step,
   * and `errorCode` is set on failure. `delivered` only ever comes from a carrier
   * delivery receipt: on a route that returns none the message stays `sent` with
   * `awaitingReceipt: true` (see `routeReturnsReceipts`). An unknown id resolves with
   * `status: 'not_found'` rather than throwing. The `sms.delivered` and `sms.failed`
   * webhooks report the same changes without polling.
   */
  getSms(messageId, opts) {
    return this.http.request("GET", `/comms/sms/${encodeURIComponent(messageId)}`, opts);
  }
};

// src/resources/dialer.ts
var DialerResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /dialer/campaigns - list campaigns (cursor-paginated). */
  listCampaigns(filters = {}, opts) {
    return this.http.page("/dialer/campaigns", {
      ...opts,
      query: { ...filters, ...opts?.query }
    });
  }
  /** POST /dialer/campaigns - create a campaign (scope: dialer:write). */
  createCampaign(input, opts) {
    return this.http.request("POST", "/dialer/campaigns", { ...opts, body: input });
  }
  /** GET /dialer/campaigns/:id - campaign detail. */
  getCampaign(id, opts) {
    return this.http.request("GET", `/dialer/campaigns/${encodeURIComponent(id)}`, opts);
  }
  /** PUT /dialer/campaigns/:id - update a campaign (scope: dialer:write). */
  updateCampaign(id, input, opts) {
    return this.http.request(
      "PUT",
      `/dialer/campaigns/${encodeURIComponent(id)}`,
      { ...opts, body: input }
    );
  }
  /** DELETE /dialer/campaigns/:id - delete a campaign (scope: dialer:write). */
  deleteCampaign(id, opts) {
    return this.http.request("DELETE", `/dialer/campaigns/${encodeURIComponent(id)}`, opts);
  }
  /** POST /dialer/campaigns/:id/control - start/pause/stop (scope: dialer:write). */
  control(id, action, opts) {
    return this.http.request("POST", `/dialer/campaigns/${encodeURIComponent(id)}/control`, {
      ...opts,
      body: { action }
    });
  }
  /** GET /dialer/campaigns/:id/stats - campaign stats. */
  stats(id, opts) {
    return this.http.request("GET", `/dialer/campaigns/${encodeURIComponent(id)}/stats`, opts);
  }
  /** POST /dialer/campaigns/:id/numbers - upload dial numbers (scope: dialer:write). */
  uploadNumbers(id, numbers, opts) {
    return this.http.request("POST", `/dialer/campaigns/${encodeURIComponent(id)}/numbers`, {
      ...opts,
      body: { numbers }
    });
  }
  /** GET /dialer/campaigns/:id/numbers - list dial numbers (cursor-paginated). */
  listNumbers(id, filters = {}, opts) {
    return this.http.page(`/dialer/campaigns/${encodeURIComponent(id)}/numbers`, {
      ...opts,
      query: { ...filters, ...opts?.query }
    });
  }
  /** DELETE /dialer/campaigns/:id/numbers - clear all numbers (scope: dialer:write). */
  clearNumbers(id, opts) {
    return this.http.request(
      "DELETE",
      `/dialer/campaigns/${encodeURIComponent(id)}/numbers`,
      opts
    );
  }
  /** POST /dialer/campaigns/:id/clis - upload caller IDs (scope: dialer:write). */
  uploadClis(id, clis, opts) {
    return this.http.request("POST", `/dialer/campaigns/${encodeURIComponent(id)}/clis`, {
      ...opts,
      body: { clis }
    });
  }
  /** GET /dialer/campaigns/:id/clis - list caller IDs. */
  listClis(id, opts) {
    return this.http.request("GET", `/dialer/campaigns/${encodeURIComponent(id)}/clis`, opts);
  }
  /** DELETE /dialer/campaigns/:id/clis - clear all CLIs (scope: dialer:write). */
  clearClis(id, opts) {
    return this.http.request("DELETE", `/dialer/campaigns/${encodeURIComponent(id)}/clis`, opts);
  }
};

// src/resources/purchases.ts
var PurchasesResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** POST /purchases - buy a route. */
  create(routeId, opts) {
    return this.http.request("POST", "/purchases", { ...opts, body: { routeId } });
  }
  /** GET /purchases - list the caller's purchases (cursor-paginated). */
  list(filters = {}, opts) {
    return this.http.page("/purchases", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /** GET /purchases/:id - purchase detail. */
  get(id, opts) {
    return this.http.request("GET", `/purchases/${encodeURIComponent(id)}`, opts);
  }
  /** GET /purchases/:id/usage - per-purchase usage analytics. */
  usage(id, opts) {
    return this.http.request("GET", `/purchases/${encodeURIComponent(id)}/usage`, opts);
  }
  /** PATCH /purchases/:id - pause or resume (active or paused). */
  setStatus(id, status, opts) {
    return this.http.request("PATCH", `/purchases/${encodeURIComponent(id)}`, { ...opts, body: { status } });
  }
  // ── Routing order: which of your voice purchases carries a call ──────────────
  // Your SIP credentials identify your ACCOUNT, not a route, so every active voice
  // purchase covering a number is a candidate. Longest prefix wins; among equals your
  // routing order decides, then the cheaper rate, then the older purchase.
  /** GET /purchases/routing-order - your voice purchases in routing order (ranked first). */
  routingOrder(opts) {
    return this.http.request("GET", "/purchases/routing-order", opts);
  }
  /**
   * PUT /purchases/routing-order - replace the whole order atomically. `purchaseIds[0]`
   * becomes position 1; every other voice purchase is cleared to unranked. An empty
   * array clears the order.
   */
  setRoutingOrder(purchaseIds, opts) {
    return this.http.request("PUT", "/purchases/routing-order", { ...opts, body: { purchaseIds } });
  }
  /** PATCH /purchases/:id/routing-priority - set (1 = first) or clear (null) one position. */
  setRoutingPriority(id, priority, opts) {
    return this.http.request("PATCH", `/purchases/${encodeURIComponent(id)}/routing-priority`, {
      ...opts,
      body: { priority }
    });
  }
  /**
   * GET /purchases/route-for - which of your routes would carry `to`, using the same
   * ranking as the live call path, plus any refusal (embargo, empty balance). Read-only.
   */
  routeFor(to, opts) {
    return this.http.request("GET", "/purchases/route-for", { ...opts, query: { to, ...opts?.query } });
  }
  /**
   * GET /purchases/:id/upcoming-rate-changes - rate changes the seller has scheduled on a
   * route you bought, with old and new rates and whether you accepted each in advance.
   * Pass a `changeId` to `acceptRate` to accept one before its date.
   */
  upcomingRateChanges(id, opts) {
    return this.http.request(
      "GET",
      `/purchases/${encodeURIComponent(id)}/upcoming-rate-changes`,
      opts
    );
  }
  /**
   * POST /purchases/:id/accept-rate - accept a rate increase. With `changeId`, accepts a
   * SCHEDULED change in advance (nothing resumes or bills now); otherwise resumes a
   * purchase paused by a rise, at the rate (or deck version) you reviewed.
   */
  acceptRate(id, input = {}, opts) {
    return this.http.request(
      "POST",
      `/purchases/${encodeURIComponent(id)}/accept-rate`,
      { ...opts, body: input }
    );
  }
  /** DELETE /purchases/:id - cancel a purchase. */
  cancel(id, opts) {
    return this.http.request("DELETE", `/purchases/${encodeURIComponent(id)}`, opts);
  }
};

// src/resources/offers.ts
var OffersResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** POST /offers - open a negotiation on a route. */
  create(input, opts) {
    return this.http.request("POST", "/offers", { ...opts, body: input });
  }
  /** POST /offers/bulk - one offer across many routes (creates a group). */
  bulk(input, opts) {
    return this.http.request("POST", "/offers/bulk", { ...opts, body: input });
  }
  /** GET /offers?role= - list offers from the buyer's or seller's perspective. */
  list(role = "all", filters = {}, opts) {
    return this.http.request("GET", "/offers", {
      ...opts,
      query: { role, ...filters, ...opts?.query }
    });
  }
  /** GET /offers/:id - offer detail. */
  get(id, opts) {
    return this.http.request("GET", `/offers/${encodeURIComponent(id)}`, opts);
  }
  /** PATCH /offers/:id - counter / accept / reject / withdraw. */
  act(id, input, opts) {
    return this.http.request(
      "PATCH",
      `/offers/${encodeURIComponent(id)}`,
      { ...opts, body: input }
    );
  }
  /** GET /offers/groups - the caller's bulk offer groups. */
  groups(opts) {
    return this.http.request("GET", "/offers/groups", opts);
  }
  /** POST /offers/groups/:id/respond - seller accepts/rejects a whole group. */
  respondGroup(id, input, opts) {
    return this.http.request("POST", `/offers/groups/${encodeURIComponent(id)}/respond`, {
      ...opts,
      body: input
    });
  }
};

// src/resources/billing.ts
var BillingResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /billing/summary - dashboard spend/earnings/balance summary. */
  summary(opts) {
    return this.http.request("GET", "/billing/summary", opts);
  }
  /** GET /billing/transactions - ledger history (cursor-paginated). */
  transactions(filters = {}, opts) {
    return this.http.page("/billing/transactions", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /** GET /billing/balance-history?days= - running balance over time. */
  balanceHistory(days = 30, opts) {
    return this.http.request("GET", "/billing/balance-history", { ...opts, query: { days, ...opts?.query } });
  }
  /** GET /billing/cdrs - call/message detail records (cursor-paginated). */
  cdrs(filters = {}, opts) {
    return this.http.page("/billing/cdrs", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /**
   * GET /billing/cdrs/export - streamed CSV of CDRs in a date range. Returns the
   * raw `Response` so callers can stream the body themselves (the endpoint does
   * not use the JSON envelope). Throws on a non-2xx status.
   */
  async exportCdrs(range = {}, opts) {
    return this.http.requestRaw("GET", "/billing/cdrs/export", { ...opts, query: { ...range, ...opts?.query } });
  }
};

// src/resources/account.ts
var AccountResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /account - the caller's profile. */
  get(opts) {
    return this.http.request("GET", "/account", opts);
  }
  /** PUT /account - update profile fields. */
  update(input, opts) {
    return this.http.request("PUT", "/account", { ...opts, body: input });
  }
  /** GET /account/balance - current balance + test credit. */
  balance(opts) {
    return this.http.request("GET", "/account/balance", opts);
  }
  /**
   * GET /account/api-usage - request volume, error rate, p95 latency, per-day counts
   * and top endpoints over a trailing window (1-90 days, default 7).
   *
   * Pass `keyId` to see ONE of your API keys; omit it for all account traffic,
   * dashboard sessions included. A bare number is still accepted as `days` so
   * 0.1.x call sites (`apiUsage(30)`) keep working.
   */
  apiUsage(params = {}, opts) {
    const q = typeof params === "number" ? { days: params } : params;
    return this.http.request("GET", "/account/api-usage", {
      ...opts,
      query: { days: q.days ?? 7, keyId: q.keyId, ...opts?.query }
    });
  }
  /** API key management (CRUD). All paths under /account/api-keys. */
  apiKeys = {
    /** GET /account/api-keys - list keys (secrets redacted). */
    list: (opts) => this.http.request("GET", "/account/api-keys", opts),
    /** POST /account/api-keys - create a key. The plaintext secret is returned ONCE. */
    create: (input, opts) => this.http.request("POST", "/account/api-keys", { ...opts, body: input }),
    /** PATCH /account/api-keys/:id - relabel and/or tighten scopes. */
    update: (id, input, opts) => this.http.request("PATCH", `/account/api-keys/${encodeURIComponent(id)}`, { ...opts, body: input }),
    /** DELETE /account/api-keys/:id - revoke a key. */
    revoke: (id, opts) => this.http.request("DELETE", `/account/api-keys/${encodeURIComponent(id)}`, opts)
  };
  /** Spend-alert config. */
  alerts = {
    /** GET /account/alerts - current alert thresholds. */
    get: (opts) => this.http.request("GET", "/account/alerts", opts),
    /** PUT /account/alerts - upsert thresholds (null clears one). */
    set: (input, opts) => this.http.request("PUT", "/account/alerts", { ...opts, body: input })
  };
  /** Login sessions (mounted under /auth on the wire). */
  sessions = {
    /** GET /auth/sessions - active sessions for the caller. */
    list: (opts) => this.http.request("GET", "/auth/sessions", opts),
    /** DELETE /auth/sessions/:id - revoke one session. */
    revoke: (id, opts) => this.http.request("DELETE", `/auth/sessions/${encodeURIComponent(id)}`, opts),
    /** POST /auth/sessions/revoke-others - revoke all sessions but the current. */
    revokeOthers: (opts) => this.http.request("POST", "/auth/sessions/revoke-others", opts)
  };
};

// src/resources/webhooks.ts
var WebhooksResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /account/webhooks - list endpoints (secret redacted to its last 4). */
  list(opts) {
    return this.http.request("GET", "/account/webhooks", opts);
  }
  /** POST /account/webhooks - create an endpoint; `secret` is returned once. */
  create(input, opts) {
    return this.http.request("POST", "/account/webhooks", { ...opts, body: input });
  }
  /** PATCH /account/webhooks/:id - update url / events / isActive (secret kept). */
  update(id, input, opts) {
    return this.http.request("PATCH", `/account/webhooks/${encodeURIComponent(id)}`, { ...opts, body: input });
  }
  /** DELETE /account/webhooks/:id - remove an endpoint and its history. */
  delete(id, opts) {
    return this.http.request(
      "DELETE",
      `/account/webhooks/${encodeURIComponent(id)}`,
      opts
    );
  }
  /** POST /account/webhooks/:id/rotate-secret - new signing secret, returned once. */
  rotateSecret(id, opts) {
    return this.http.request(
      "POST",
      `/account/webhooks/${encodeURIComponent(id)}/rotate-secret`,
      opts
    );
  }
  /** POST /account/webhooks/:id/test - enqueue a signed `ping` delivery. */
  test(id, opts) {
    return this.http.request("POST", `/account/webhooks/${encodeURIComponent(id)}/test`, opts);
  }
  /** GET /account/webhooks/:id/deliveries - one endpoint's delivery attempts (paginated). */
  deliveries(id, filters = {}, opts) {
    return this.http.page(`/account/webhooks/${encodeURIComponent(id)}/deliveries`, {
      ...opts,
      query: { ...filters, ...opts?.query }
    });
  }
  /** GET /account/webhooks/deliveries - deliveries across ALL your endpoints (paginated). */
  listAllDeliveries(filters = {}, opts) {
    return this.http.page("/account/webhooks/deliveries", {
      ...opts,
      query: { ...filters, ...opts?.query }
    });
  }
  /** Async-iterate every delivery across all pages of the account-wide list. */
  iterateDeliveries(filters = {}, opts) {
    return this.http.paginate("/account/webhooks/deliveries", {
      ...opts,
      query: { ...filters, ...opts?.query }
    });
  }
  /** GET /account/webhooks/deliveries/:deliveryId - one delivery with its payload. */
  getDelivery(deliveryId, opts) {
    return this.http.request(
      "GET",
      `/account/webhooks/deliveries/${encodeURIComponent(deliveryId)}`,
      opts
    );
  }
  /**
   * POST /account/webhooks/deliveries/:deliveryId/resend - queue a NEW delivery with
   * the same event and payload, signed with a fresh timestamp. The original is left
   * as it was. The new delivery has its own id, so de-duplicate on your event data.
   */
  resendDelivery(deliveryId, opts) {
    return this.http.request(
      "POST",
      `/account/webhooks/deliveries/${encodeURIComponent(deliveryId)}/resend`,
      opts
    );
  }
};

// src/resources/cli-tests.ts
var CliTestsResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** POST /cli-tests - request a new caller-ID test. */
  create(input, opts) {
    return this.http.request("POST", "/cli-tests", { ...opts, body: input });
  }
  /** GET /cli-tests - list the caller's tests (cursor-paginated). */
  list(filters = {}, opts) {
    return this.http.page("/cli-tests", { ...opts, query: { ...filters, ...opts?.query } });
  }
  /** GET /cli-tests/:id - test detail. */
  get(id, opts) {
    return this.http.request("GET", `/cli-tests/${encodeURIComponent(id)}`, opts);
  }
  /** POST /cli-tests/:id/cancel - cancel a not-yet-run test. */
  cancel(id, opts) {
    return this.http.request("POST", `/cli-tests/${encodeURIComponent(id)}/cancel`, opts);
  }
  /** GET /cli-tests/quota - per-test cost + remaining hourly quota. */
  quota(opts) {
    return this.http.request("GET", "/cli-tests/quota", opts);
  }
  // ── Route liveness tests ("test these N routes") ───────────────────────────
  // One real test call per route to a handset in its country. Each route is charged
  // the test price ONLY if it rang; routes that do not ring cost nothing.
  /** POST /cli-tests/batches/preview - what a route test would do and cost. Writes nothing. */
  previewBatch(routeIds, opts) {
    return this.http.request("POST", "/cli-tests/batches/preview", { ...opts, body: { routeIds } });
  }
  /** POST /cli-tests/batches - start a route test. Poll `getBatch` while `active` is true. */
  createBatch(input, opts) {
    return this.http.request("POST", "/cli-tests/batches", { ...opts, body: input });
  }
  /** GET /cli-tests/batches - your route tests, newest first (limit 1-50, default 20). */
  listBatches(params = {}, opts) {
    return this.http.request("GET", "/cli-tests/batches", { ...opts, query: { ...params, ...opts?.query } });
  }
  /** GET /cli-tests/batches/:id - live per-route status and results. */
  getBatch(id, opts) {
    return this.http.request("GET", `/cli-tests/batches/${encodeURIComponent(id)}`, opts);
  }
  /** POST /cli-tests/batches/:id/cancel - cancel every route not yet called (never charged). */
  cancelBatch(id, opts) {
    return this.http.request("POST", `/cli-tests/batches/${encodeURIComponent(id)}/cancel`, opts);
  }
  /** GET /cli-tests/provider-status - whether caller-ID testing is available. */
  providerStatus(opts) {
    return this.http.request("GET", "/cli-tests/provider-status", opts);
  }
};

// src/resources/interconnections.ts
var InterconnectionsResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /interconnections - all the caller's connections (with route/purchase). */
  list(opts) {
    return this.http.request("GET", "/interconnections", opts);
  }
  /** GET /interconnections/:id - single connection detail. */
  get(id, opts) {
    return this.http.request("GET", `/interconnections/${encodeURIComponent(id)}`, opts);
  }
  /** GET /interconnections/status/summary - counts + SIP public IP. */
  statusSummary(opts) {
    return this.http.request("GET", "/interconnections/status/summary", opts);
  }
  /** GET /interconnections/health - per-connection live bind/reachability state. */
  health(opts) {
    return this.http.request("GET", "/interconnections/health", opts);
  }
  /** POST /interconnections/test - run a SIP/SMPP connectivity test. */
  test(params, opts) {
    return this.http.request("POST", "/interconnections/test", { ...opts, body: params });
  }
  /** POST /interconnections/:purchaseId/rotate-credentials - issue fresh SIP/SMPP creds (returned once). */
  rotateCredentials(purchaseId, opts) {
    return this.http.request(
      "POST",
      `/interconnections/${encodeURIComponent(purchaseId)}/rotate-credentials`,
      opts
    );
  }
};

// src/resources/verify.ts
var VerifyResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * POST /verify/start - create a verification and send the code.
   * Rate limited: at most 5 starts per number per hour, a 30 second resend cooldown and
   * a daily cap per account (a `PacketExchangeError` with status 429 and code
   * `RATE_LIMITED`; `details.retryAfterSeconds` says when to retry).
   */
  start(params, opts) {
    return this.http.request("POST", "/verify/start", {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey
    });
  }
  /** POST /verify/check - check a code the user entered. */
  check(params, opts) {
    return this.http.request("POST", "/verify/check", { ...opts, body: params });
  }
  /** GET /verify/:id - current state of a verification (never includes the code). */
  get(verificationId, opts) {
    return this.http.request("GET", `/verify/${encodeURIComponent(verificationId)}`, opts);
  }
};

// src/resources/lookup.ts
var LookupResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * GET /lookup/:number - look up one number. Send it in international format
   * (`+447700900123`; spaces and dashes are ignored). A malformed number resolves with
   * `valid: false` and a `reason` rather than throwing.
   */
  number(number, opts) {
    return this.http.request("GET", `/lookup/${encodeURIComponent(number.trim())}`, opts);
  }
};

// src/resources/numbers.ts
var NumbersResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /dids/:id/ai-agent - the AI voice agent assigned to a number (scope: numbers:read). */
  getAiAgent(numberId, opts) {
    return this.http.request("GET", `/dids/${encodeURIComponent(numberId)}/ai-agent`, opts);
  }
  /**
   * PUT /dids/:id/ai-agent - assign one of your AI voice agents to a number, or pass
   * `null` to return the number to its call flow (scope: numbers:write). `live` in the
   * response says whether inbound AI answering is currently enabled on the platform.
   */
  setAiAgent(numberId, agentId, opts) {
    return this.http.request("PUT", `/dids/${encodeURIComponent(numberId)}/ai-agent`, {
      ...opts,
      body: { agentId }
    });
  }
};

// src/resources/misc.ts
var NotificationsResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /notifications - list notifications (+ unread count). */
  list(params = {}, opts) {
    return this.http.request("GET", "/notifications", {
      ...opts,
      query: { unread: params.unread ? "1" : void 0, limit: params.limit, ...opts?.query }
    });
  }
  /** POST /notifications/:id/read - mark one notification read. */
  markRead(id, opts) {
    return this.http.request("POST", `/notifications/${encodeURIComponent(id)}/read`, opts);
  }
  /** POST /notifications/read-all - mark all notifications read. */
  markAllRead(opts) {
    return this.http.request("POST", "/notifications/read-all", opts);
  }
};
var DncResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /dnc - the caller's own + global suppression entries. */
  list(opts) {
    return this.http.request("GET", "/dnc", opts);
  }
  /** POST /dnc - add a single number (idempotent). */
  add(phoneNumber, reason, opts) {
    return this.http.request("POST", "/dnc", { ...opts, body: { phoneNumber, reason } });
  }
  /** POST /dnc/bulk - add many numbers at once (deduped). */
  addBulk(numbers, opts) {
    return this.http.request("POST", "/dnc/bulk", {
      ...opts,
      body: { numbers }
    });
  }
  /** DELETE /dnc/:id - remove one of the caller's own entries. */
  remove(id, opts) {
    return this.http.request("DELETE", `/dnc/${encodeURIComponent(id)}`, opts);
  }
};
var FavoritesResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /account/favorites - favorited routes with summaries. */
  list(opts) {
    return this.http.request("GET", "/account/favorites", opts);
  }
  /** POST /account/favorites - favorite a route (idempotent). */
  add(routeId, opts) {
    return this.http.request("POST", "/account/favorites", { ...opts, body: { routeId } });
  }
  /** DELETE /account/favorites/:routeId - unfavorite a route. */
  remove(routeId, opts) {
    return this.http.request(
      "DELETE",
      `/account/favorites/${encodeURIComponent(routeId)}`,
      opts
    );
  }
};
var SavedSearchesResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /** GET /account/saved-searches - the caller's saved searches. */
  list(opts) {
    return this.http.request("GET", "/account/saved-searches", opts);
  }
  /** POST /account/saved-searches - save a search (name + opaque filters object). */
  create(input, opts) {
    return this.http.request("POST", "/account/saved-searches", { ...opts, body: input });
  }
  /** DELETE /account/saved-searches/:id - remove a saved search. */
  delete(id, opts) {
    return this.http.request(
      "DELETE",
      `/account/saved-searches/${encodeURIComponent(id)}`,
      opts
    );
  }
};

// src/client.ts
var PacketExchange = class {
  /** Low-level HTTP core (exposed for advanced/custom requests). */
  http;
  routes;
  comms;
  dialer;
  purchases;
  offers;
  billing;
  account;
  webhooks;
  cliTests;
  interconnections;
  /** Verify API: send a one-time code by SMS or voice and check it. */
  verify;
  /** Number lookup: country, line type, network, risk flags and cheapest price (free, prefix-based). */
  lookup;
  /** Phone numbers you bought. */
  numbers;
  notifications;
  dnc;
  favorites;
  savedSearches;
  constructor(opts = {}) {
    this.http = new HttpClient(opts);
    this.routes = new RoutesResource(this.http);
    this.comms = new CommsResource(this.http);
    this.dialer = new DialerResource(this.http);
    this.purchases = new PurchasesResource(this.http);
    this.offers = new OffersResource(this.http);
    this.billing = new BillingResource(this.http);
    this.account = new AccountResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.cliTests = new CliTestsResource(this.http);
    this.interconnections = new InterconnectionsResource(this.http);
    this.verify = new VerifyResource(this.http);
    this.lookup = new LookupResource(this.http);
    this.numbers = new NumbersResource(this.http);
    this.notifications = new NotificationsResource(this.http);
    this.dnc = new DncResource(this.http);
    this.favorites = new FavoritesResource(this.http);
    this.savedSearches = new SavedSearchesResource(this.http);
  }
};

// src/webhook-signature.ts
var enc = new TextEncoder();
function header(h, name) {
  if (typeof h.get === "function") {
    return h.get(name) ?? void 0;
  }
  const rec = h;
  const key = Object.keys(rec).find((k) => k.toLowerCase() === name.toLowerCase());
  const v = key ? rec[key] : void 0;
  return Array.isArray(v) ? v[0] : v;
}
function toBytes(body) {
  if (typeof body === "string") return enc.encode(body);
  return body instanceof Uint8Array ? body : new Uint8Array(body);
}
function concat(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}
async function hmacHex(secret, data) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("WebCrypto (globalThis.crypto.subtle) is required to verify webhook signatures.");
  const key = await subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await subtle.sign("HMAC", key, data));
  let hex = "";
  for (const b of sig) hex += b.toString(16).padStart(2, "0");
  return hex;
}
function safeEqual(a, b) {
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
async function verifyWebhookSignature(p) {
  const tolerance = p.toleranceSeconds ?? 300;
  const body = toBytes(p.rawBody);
  const tsHeader = header(p.headers, "x-px-timestamp");
  const v1Header = header(p.headers, "x-px-signature");
  if (tsHeader !== void 0 || v1Header !== void 0) {
    if (!tsHeader || !v1Header) return { valid: false, scheme: "v1", reason: "missing_signature" };
    if (!/^\d+$/.test(tsHeader)) return { valid: false, scheme: "v1", reason: "bad_timestamp" };
    const ts = Number(tsHeader);
    const now = p.now ?? Math.floor(Date.now() / 1e3);
    if (Math.abs(now - ts) > tolerance) return { valid: false, scheme: "v1", reason: "stale_timestamp", timestamp: ts };
    const expected2 = await hmacHex(p.secret, concat(enc.encode(`${tsHeader}.`), body));
    const candidates = v1Header.split(",").map((s) => s.trim()).filter((s) => s.startsWith("v1=")).map((s) => s.slice(3));
    const valid2 = candidates.some((c) => safeEqual(c.toLowerCase(), expected2));
    return valid2 ? { valid: valid2, scheme: "v1", timestamp: ts } : { valid: valid2, scheme: "v1", reason: "mismatch", timestamp: ts };
  }
  const legacy = header(p.headers, "x-webhook-signature");
  if (!legacy) return { valid: false, scheme: "none", reason: "missing_signature" };
  if (p.allowLegacy === false) return { valid: false, scheme: "legacy", reason: "legacy_disallowed" };
  const expected = await hmacHex(p.secret, body);
  const given = legacy.startsWith("sha256=") ? legacy.slice(7) : legacy;
  const valid = safeEqual(given.toLowerCase(), expected);
  return valid ? { valid, scheme: "legacy" } : { valid, scheme: "legacy", reason: "mismatch" };
}
export {
  AccountResource,
  BillingResource,
  CliTestsResource,
  CommsResource,
  DEFAULT_BASE_URL,
  DialerResource,
  DncResource,
  FINAL_CALL_STATUSES,
  FavoritesResource,
  HttpClient,
  InterconnectionsResource,
  LookupResource,
  NotificationsResource,
  NumbersResource,
  OffersResource,
  PacketExchange,
  PacketExchangeError,
  PurchasesResource,
  RoutesResource,
  SavedSearchesResource,
  VerifyResource,
  WebhooksResource,
  verifyWebhookSignature
};
