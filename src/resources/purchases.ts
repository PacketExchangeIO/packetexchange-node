import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { Purchase, PurchaseWithRoute } from '../shared-types.js';
import type {
  RoutingOrderEntry,
  RoutingOrderResult,
  RouteForResult,
  PurchaseUpcomingRateChanges,
  PurchaseRow,
  LcrView,
  FailoverOverview,
} from '../generated/schemas.js';

/** What `acceptRate` returns when a scheduled change is accepted in advance. */
export interface ScheduledChangeAcceptance {
  accepted: true;
  changeId: string;
  purchaseId: string;
  effectiveDate: string;
}

/**
 * One line of `purchases.setLcrOrder()`: a route you bought by `purchaseId`, or one of
 * your own routes or blends by `routeId`.
 */
export type LcrOrderLine = { purchaseId: string } | { routeId: string };

/**
 * How much more a backup route may cost than the route a call was first sent to:
 * `same_or_lower` (default), `up_to_10` or `up_to_25` percent more, `any`, or `off`
 * (no failover).
 */
export type FailoverPriceLimit = 'same_or_lower' | 'up_to_10' | 'up_to_25' | 'any' | 'off';

/** A route you already hold, from `purchases.owned()`. */
export interface OwnedPurchase {
  /** The purchase id. */
  id: string;
  status: 'active' | 'pending_review';
  /** SMS routes: the state of the content review, when there is one. */
  smsReview: string | null;
}

/** Filters for the purchases list. */
export interface PurchaseFilters {
  status?: 'active' | 'paused' | 'cancelled' | 'pending';
  cursor?: string;
  limit?: number;
}

/**
 * Route purchases: buy a route, list/inspect purchases, view per-purchase
 * usage, pause/resume, and cancel.
 */
export class PurchasesResource {
  constructor(private readonly http: HttpClient) {}

  /** POST /purchases - buy a route. */
  create(routeId: string, opts?: RequestOptions): Promise<PurchaseWithRoute> {
    return this.http.request<PurchaseWithRoute>('POST', '/purchases', { ...opts, body: { routeId } });
  }

  /** GET /purchases - list the caller's purchases (cursor-paginated). */
  list(filters: PurchaseFilters = {}, opts?: RequestOptions): Promise<Page<PurchaseWithRoute>> {
    return this.http.page<PurchaseWithRoute>('/purchases', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /** GET /purchases/:id - purchase detail. */
  get(id: string, opts?: RequestOptions): Promise<PurchaseWithRoute> {
    return this.http.request<PurchaseWithRoute>('GET', `/purchases/${encodeURIComponent(id)}`, opts);
  }

  /** GET /purchases/:id/usage - per-purchase usage analytics. */
  usage(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', `/purchases/${encodeURIComponent(id)}/usage`, opts);
  }

  /** PATCH /purchases/:id - pause or resume (active or paused). */
  setStatus(id: string, status: 'active' | 'paused', opts?: RequestOptions): Promise<Purchase> {
    return this.http.request<Purchase>('PATCH', `/purchases/${encodeURIComponent(id)}`, { ...opts, body: { status } });
  }

  // ── Routing order: which of your voice purchases carries a call ──────────────
  // Your SIP credentials identify your ACCOUNT, not a route, so every active voice
  // purchase covering a number is a candidate. Longest prefix wins; among equals your
  // routing order decides, then the cheaper rate, then the older purchase.

  /** GET /purchases/routing-order - your voice purchases in routing order (ranked first). */
  routingOrder(opts?: RequestOptions): Promise<RoutingOrderEntry[]> {
    return this.http.request<RoutingOrderEntry[]>('GET', '/purchases/routing-order', opts);
  }

  /**
   * PUT /purchases/routing-order - replace the whole order atomically. `purchaseIds[0]`
   * becomes position 1; every other voice purchase is cleared to unranked. An empty
   * array clears the order.
   */
  setRoutingOrder(purchaseIds: string[], opts?: RequestOptions): Promise<RoutingOrderResult> {
    return this.http.request<RoutingOrderResult>('PUT', '/purchases/routing-order', { ...opts, body: { purchaseIds } });
  }

  /** PATCH /purchases/:id/routing-priority - set (1 = first) or clear (null) one position. */
  setRoutingPriority(id: string, priority: number | null, opts?: RequestOptions): Promise<{ id: string; routingPriority: number | null }> {
    return this.http.request<{ id: string; routingPriority: number | null }>('PATCH', `/purchases/${encodeURIComponent(id)}/routing-priority`, {
      ...opts,
      body: { priority },
    });
  }

  /**
   * GET /purchases/route-for - which of your routes would carry `to`, using the same
   * ranking as the live call path, plus any refusal (embargo, empty balance). Read-only.
   */
  routeFor(to: string, opts?: RequestOptions): Promise<RouteForResult> {
    return this.http.request<RouteForResult>('GET', '/purchases/route-for', { ...opts, query: { to, ...opts?.query } });
  }

  /**
   * GET /purchases/:id/upcoming-rate-changes - rate changes the seller has scheduled on a
   * route you bought, with old and new rates and whether you accepted each in advance.
   * Pass a `changeId` to `acceptRate` to accept one before its date.
   */
  upcomingRateChanges(id: string, opts?: RequestOptions): Promise<PurchaseUpcomingRateChanges> {
    return this.http.request<PurchaseUpcomingRateChanges>(
      'GET',
      `/purchases/${encodeURIComponent(id)}/upcoming-rate-changes`,
      opts,
    );
  }

  /**
   * POST /purchases/:id/accept-rate - accept a rate increase. With `changeId`, accepts a
   * SCHEDULED change in advance (nothing resumes or bills now); otherwise resumes a
   * purchase paused by a rise, at the rate (or deck version) you reviewed.
   */
  acceptRate(
    id: string,
    input: { acceptedRate?: string | number; deckVersion?: string; changeId?: string } = {},
    opts?: RequestOptions,
  ): Promise<PurchaseRow | ScheduledChangeAcceptance> {
    return this.http.request<PurchaseRow | ScheduledChangeAcceptance>(
      'POST',
      `/purchases/${encodeURIComponent(id)}/accept-rate`,
      { ...opts, body: input },
    );
  }

  /**
   * GET /purchases/lcr - every route that can carry a call to `to` from your account, in
   * the order a call tries them, with your rate, latest test and last-24-hour calls for
   * each, plus `warnings` and any `refused` reason. Limited to 60 requests a minute.
   */
  lcr(to: string, opts?: RequestOptions): Promise<LcrView> {
    return this.http.request<LcrView>('GET', '/purchases/lcr', { ...opts, query: { to, ...opts?.query } });
  }

  /**
   * PUT /purchases/lcr-order - reorder the lines `lcr` showed for one number. Other routes
   * and destinations keep their place. Voice routes only; needs a live key.
   */
  setLcrOrder(
    order: LcrOrderLine[],
    opts?: RequestOptions,
  ): Promise<{ order: Array<{ purchaseId?: string; routeId?: string; position: number }> }> {
    return this.http.request<{ order: Array<{ purchaseId?: string; routeId?: string; position: number }> }>(
      'PUT',
      '/purchases/lcr-order',
      { ...opts, body: { order } },
    );
  }

  /**
   * GET /purchases/failover - for each destination, the route tried first and the backups
   * behind it, plus your automatic failover settings. Read-only.
   */
  failover(opts?: RequestOptions): Promise<FailoverOverview> {
    return this.http.request<FailoverOverview>('GET', '/purchases/failover', opts);
  }

  /** PUT /purchases/failover/price-limit - how much more a backup may cost (`off` disables failover). Needs a live key. */
  setFailoverPriceLimit(priceLimit: FailoverPriceLimit, opts?: RequestOptions): Promise<{ priceLimit: FailoverPriceLimit }> {
    return this.http.request<{ priceLimit: FailoverPriceLimit }>('PUT', '/purchases/failover/price-limit', {
      ...opts,
      body: { priceLimit },
    });
  }

  /**
   * GET /purchases/owned/:routeId - your active purchase of a route, or one awaiting
   * review, so you can avoid buying it twice. `null` when you hold neither.
   */
  owned(routeId: string, opts?: RequestOptions): Promise<OwnedPurchase | null> {
    return this.http.request<OwnedPurchase | null>('GET', `/purchases/owned/${encodeURIComponent(routeId)}`, opts);
  }

  /** DELETE /purchases/:id - cancel a purchase. */
  cancel(id: string, opts?: RequestOptions): Promise<Purchase> {
    return this.http.request<Purchase>('DELETE', `/purchases/${encodeURIComponent(id)}`, opts);
  }
}
