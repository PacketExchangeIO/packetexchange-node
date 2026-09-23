import type {
  HttpClient,
  Page,
  RequestOptions,
} from '../http.js';
import type {
  Route,
  RouteCreateInput,
  RouteUpdateInput,
  RouteFilterInput,
} from '../shared-types.js';
import type { PriceNumberResult } from '../generated/schemas.js';

/** Smart-routing strategy used by `resolve` and the comms send methods. */
export type RoutingStrategy = 'cheapest' | 'best_quality' | 'balanced';

/** Params for `routes.resolve()` - Smart Routing preview. */
export interface ResolveParams {
  to: string;
  type?: 'voice' | 'sms';
  strategy?: RoutingStrategy;
}

/**
 * Marketplace routes: public listing/search, details, Smart-Routing preview,
 * country list, aggregate stats, the caller's own routes, and price history.
 */
export class RoutesResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /routes - public marketplace listing. Returns `{ data, total }`. */
  list(filters: Partial<RouteFilterInput> = {}, opts?: RequestOptions): Promise<Page<Route>> {
    return this.http.page<Route>('/routes', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /** Async-iterate every route across all pages of the marketplace listing. */
  listAll(filters: Partial<RouteFilterInput> = {}, opts?: RequestOptions): AsyncGenerator<Route> {
    return this.http.paginate<Route>('/routes', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /** GET /routes/:id - route details (public for live routes). */
  get(id: string, opts?: RequestOptions): Promise<Route> {
    return this.http.request<Route>('GET', `/routes/${encodeURIComponent(id)}`, opts);
  }

  /** GET /routes/resolve - which route(s) Smart Routing would pick for a number. */
  resolve(params: ResolveParams, opts?: RequestOptions) {
    return this.http.request<{
      strategy: RoutingStrategy;
      selected: ResolvedRoute | null;
      alternatives: ResolvedRoute[];
      count: number;
    }>('GET', '/routes/resolve', { ...opts, query: { ...params, ...opts?.query } });
  }

  /**
   * GET /routes/price-number - every marketplace route that serves `number`, at the rate
   * it would actually charge for it (longest-prefix rate-sheet row, or the flat price),
   * cheapest first. Public list prices; at most 100 routes (`total` counts all).
   */
  priceNumber(params: { number: string; type?: 'voice' | 'sms' }, opts?: RequestOptions): Promise<PriceNumberResult> {
    return this.http.request<PriceNumberResult>('GET', '/routes/price-number', { ...opts, query: { ...params, ...opts?.query } });
  }

  /** GET /routes/countries - distinct destination countries across the market. */
  countries(opts?: RequestOptions) {
    return this.http.request<Array<{ country: string; countryCode: string | null; count: number }>>(
      'GET',
      '/routes/countries',
      opts,
    );
  }

  /** GET /routes/stats - KPI aggregates over the full filtered set. */
  stats(filters: Partial<RouteFilterInput> = {}, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', '/routes/stats', {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /** GET /routes/my/list - the caller's own routes (cursor-paginated). */
  myList(params: { cursor?: string; limit?: number } = {}, opts?: RequestOptions): Promise<Page<Route>> {
    return this.http.page<Route>('/routes/my/list', { ...opts, query: { ...params, ...opts?.query } });
  }

  /** GET /routes/:id/price-history - price-change log (owner/buyer only). */
  priceHistory(id: string, opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>(
      'GET',
      `/routes/${encodeURIComponent(id)}/price-history`,
      opts,
    );
  }

  /** GET /routes/:id/stats - owner-only operational stats for one route. */
  ownerStats(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', `/routes/${encodeURIComponent(id)}/stats`, opts);
  }

  /** POST /routes - create a route (sellers). */
  create(input: RouteCreateInput, opts?: RequestOptions): Promise<Route> {
    return this.http.request<Route>('POST', '/routes', { ...opts, body: input });
  }

  /** PUT /routes/:id - update a route the caller owns. */
  update(id: string, input: RouteUpdateInput, opts?: RequestOptions): Promise<Route> {
    return this.http.request<Route>('PUT', `/routes/${encodeURIComponent(id)}`, { ...opts, body: input });
  }

  /** DELETE /routes/:id - delete a route the caller owns. */
  delete(id: string, opts?: RequestOptions) {
    return this.http.request<{ message: string }>('DELETE', `/routes/${encodeURIComponent(id)}`, opts);
  }
}

/** One candidate from a Smart-Routing resolve. */
export interface ResolvedRoute {
  id: string;
  destinationName: string;
  country: string;
  countryCode: string | null;
  type: 'voice' | 'sms';
  cliType: string | null;
  /** USD per minute/message as a 6-decimal string (e.g. "0.012500"), like every
   *  other money field in the API. Parse with Number() or a decimal library. */
  price: string;
  asr: number | null;
  acd: number | null;
  matchedPrefix: string | null;
}
