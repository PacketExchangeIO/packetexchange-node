import { PacketExchangeError } from './errors.js';

/** Default production base URL. Override via `new PacketExchange({ baseUrl })`. */
export const DEFAULT_BASE_URL = 'https://packetexchange.io/api/v1';

/** Options accepted by the `PacketExchange` constructor. */
export interface PacketExchangeOptions {
  /** API key (`wmmn_live_sk_...` or `wmmn_test_sk_...`). Sent as `Authorization: Bearer <key>`. */
  apiKey?: string;
  /** A user JWT access token. Mutually usable with `apiKey`; `apiKey` wins if both set. */
  accessToken?: string;
  /** Override the API base URL (default: production). Trailing slash is trimmed. */
  baseUrl?: string;
  /** Inject a custom `fetch` (tests, proxies, non-global runtimes). Defaults to global `fetch`. */
  fetch?: typeof fetch;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
}

/** The JSON envelope every API response uses. */
export interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  nextCursor?: string | null;
  hasMore?: boolean;
  total?: number;
}

/** Per-call request options. */
export interface RequestOptions {
  /** Query-string params; `undefined`/`null` values are dropped. */
  query?: Record<string, unknown>;
  /** JSON request body. */
  body?: unknown;
  /** Sets `X-Idempotency-Key` so a retried call/SMS isn't processed twice. */
  idempotencyKey?: string;
  /** Per-request header overrides. */
  headers?: Record<string, string>;
  /** Optional AbortSignal for cancellation/timeouts. */
  signal?: AbortSignal;
}

/** A page of a cursor-paginated list endpoint. */
export interface Page<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}

/**
 * Thin HTTP core shared by every resource group. Holds auth + base URL,
 * serialises requests, and normalises the response envelope into either the
 * unwrapped `data` or a typed `PacketExchangeError`.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly accessToken?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly baseHeaders: Record<string, string>;

  constructor(opts: PacketExchangeOptions) {
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = opts.apiKey;
    this.accessToken = opts.accessToken;
    this.baseHeaders = opts.headers ?? {};
    // Prefer an injected implementation, else the global. The global is bound to
    // `globalThis` because some runtimes reject an unbound `fetch` call.
    const f = opts.fetch ?? (globalThis.fetch as typeof fetch | undefined);
    if (!f) {
      throw new Error(
        'No global `fetch` found. Pass `fetch` in the constructor or run on Node 18+, Bun, Deno, or a browser.',
      );
    }
    this.fetchImpl = opts.fetch ? f : f.bind(globalThis);
  }

  /** Build the Authorization header from whichever credential was supplied. */
  private authHeader(): Record<string, string> {
    // API key takes precedence; both go out as a Bearer token. The API reads ONLY
    // the Authorization header for credentials (there is no X-API-Key header).
    const cred = this.apiKey ?? this.accessToken;
    return cred ? { Authorization: `Bearer ${cred}` } : {};
  }

  /** Serialise a query object into a `?a=1&b=2` string (drops null/undefined). */
  private buildQuery(query?: Record<string, unknown>): string {
    if (!query) return '';
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        for (const item of v) sp.append(k, String(item));
      } else {
        sp.set(k, String(v));
      }
    }
    const s = sp.toString();
    return s ? `?${s}` : '';
  }

  /**
   * Core request method. Returns the unwrapped `data` on success and throws a
   * `PacketExchangeError` on a non-2xx response OR a `success:false` envelope.
   */
  async request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
    const env = await this.raw<T>(method, path, opts);
    return env.data as T;
  }

  /**
   * Perform a request and return the raw `Response` WITHOUT envelope parsing.
   * For endpoints that stream non-JSON payloads (e.g. CSV exports). Throws a
   * `PacketExchangeError` on a non-2xx status (best-effort body parse).
   */
  async requestRaw(method: string, path: string, opts: RequestOptions = {}): Promise<Response> {
    const res = await this.send(method, path, opts, {});
    if (!res.ok) {
      let envelope: Envelope<unknown> | undefined;
      try {
        envelope = (await res.clone().json()) as Envelope<unknown>;
      } catch {
        // Non-JSON error body; keep the status-derived defaults.
      }
      throw this.errorFrom(res, envelope?.error);
    }
    return res;
  }

  /**
   * Like `request`, but returns the FULL envelope - used by paginated list
   * helpers that need `nextCursor`/`hasMore`/`total` alongside `data`.
   */
  async raw<T>(method: string, path: string, opts: RequestOptions = {}): Promise<Envelope<T>> {
    const res = await this.send(method, path, opts, { Accept: 'application/json' });

    // Parse defensively: a proxy or load balancer error may not be the JSON envelope.
    // A non-JSON body becomes a synthetic error below.
    let parsed: unknown;
    const text = await res.text();
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { success: false, error: { code: `HTTP_${res.status}`, message: text || res.statusText } };
    }

    const env = parsed as Envelope<T>;

    if (!res.ok || env.success === false) throw this.errorFrom(res, env.error);
    return env;
  }

  /** Send one request with auth and JSON headers. Transport failures become `NETWORK_ERROR`. */
  private async send(
    method: string,
    path: string,
    opts: RequestOptions,
    defaultHeaders: Record<string, string>,
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}${this.buildQuery(opts.query)}`;
    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...this.baseHeaders,
      ...this.authHeader(),
      ...(opts.headers ?? {}),
    };
    if (opts.idempotencyKey) headers['X-Idempotency-Key'] = opts.idempotencyKey;
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

    try {
      return await this.fetchImpl(url, {
        method,
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal: opts.signal,
      });
    } catch (err) {
      // Transport-level failure (DNS, connection refused, abort): no HTTP status.
      throw new PacketExchangeError({
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network request failed',
        status: 0,
        details: err,
      });
    }
  }

  /** Build the typed error for a failed response from its envelope `error`, when it has one. */
  private errorFrom(res: Response, apiErr?: Envelope<unknown>['error']): PacketExchangeError {
    return new PacketExchangeError({
      code: apiErr?.code ?? `HTTP_${res.status}`,
      message: apiErr?.message ?? (res.statusText || 'Request failed'),
      status: res.status,
      details: apiErr?.details,
      requestId: res.headers.get('x-request-id') ?? undefined,
    });
  }

  /**
   * Return one page of a cursor-paginated endpoint as `{ data, nextCursor,
   * hasMore, total }`. Resource methods wrap this so list calls are uniform.
   */
  async page<T>(path: string, opts: RequestOptions = {}): Promise<Page<T>> {
    const env = await this.raw<T[]>('GET', path, opts);
    return {
      data: (env.data ?? []) as T[],
      nextCursor: env.nextCursor ?? null,
      hasMore: env.hasMore ?? false,
      total: env.total,
    };
  }

  /**
   * Async-iterate every item across all pages of a cursor-paginated endpoint,
   * transparently following `nextCursor`. The cursor is passed as `?cursor=`.
   *
   *   for await (const tx of sdk.billing.transactionsAll()) { ... }
   */
  async *paginate<T>(path: string, opts: RequestOptions = {}): AsyncGenerator<T, void, unknown> {
    let cursor: string | null = (opts.query?.cursor as string | undefined) ?? null;
    do {
      const env = await this.raw<T[]>('GET', path, {
        ...opts,
        query: { ...opts.query, cursor: cursor ?? undefined },
      });
      const items = (env.data ?? []) as T[];
      for (const item of items) yield item;
      cursor = env.hasMore ? env.nextCursor ?? null : null;
    } while (cursor);
  }
}
