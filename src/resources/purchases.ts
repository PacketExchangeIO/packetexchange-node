import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { Purchase, PurchaseWithRoute } from '../shared-types.js';
import type {
  RoutingOrderEntry,
  RoutingOrderResult,
  RouteForResult,
  PurchaseUpcomingRateChanges,
  PurchaseRow,
} from '../generated/schemas.js';

/** What `acceptRate` returns when a scheduled change is accepted in advance. */
export interface ScheduledChangeAcceptance {
  accepted: true;
  changeId: string;
  purchaseId: string;
  effectiveDate: string;
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

  /** DELETE /purchases/:id - cancel a purchase. */
  cancel(id: string, opts?: RequestOptions): Promise<Purchase> {
    return this.http.request<Purchase>('DELETE', `/purchases/${encodeURIComponent(id)}`, opts);
  }
}
