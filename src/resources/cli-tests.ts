import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { CliTestCreateInput, CliTestFilterInput } from '../shared-types.js';
import type { RouteTestBatch, RouteTestPreview } from '../generated/schemas.js';

/** Input for `cliTests.createBatch()` - a route liveness test. */
export interface RouteTestBatchInput {
  /** 2 to 20 voice routes you may test (public, your own, or bought). */
  routeIds: string[];
  /** Your own description of the set, shown back to you, e.g. "Search: Pakistan". */
  searchLabel: string;
  /** The caller ID to present, E.164, e.g. "+447700900123". */
  displayCli: string;
}

/**
 * What one caller-ID test on a route would cost now, from `cliTests.quote()`. Amounts are
 * plain JSON numbers in USD.
 */
export interface CliTestQuote {
  /** True when this test would be free. */
  free: boolean;
  /** Machine-readable reason for `free`, e.g. `not_offered` or `no_active_purchase`. */
  freeReason: string;
  /** A sentence about the free test, or empty when there is nothing to say. */
  freeMessage: string;
  /** What this test will cost; 0 when free. */
  priceUsd: number;
  /** The ordinary price of one test. */
  standardPriceUsd: number;
  payableFromTestCredit: number;
  payableFromBalance: number;
  /** How much more you need to run the test; 0 when funds cover it. */
  shortfallUsd: number;
  canRun: boolean;
  reason: 'ok' | 'insufficient_funds' | 'hourly_limit' | 'not_testable';
  /** One sentence you can show as-is. */
  message: string;
  balanceUsd: number;
  testCreditUsd: number;
  /** Test calls you may still place this hour. */
  hourlyRemaining: number;
  /** If the call connects, its minutes are billed at the route rate on top of the test price. */
  minutesBilledSeparately: true;
}

/**
 * Where a caller-ID test on a route can call, from `cliTests.testCountries()`. A
 * single-country route is `fixed`; an A-Z or regional route is `choose`, with the
 * countries that have a test handset online now (`null` when that could not be checked).
 */
export type CliTestCountries =
  | { mode: 'fixed'; country: string }
  | { mode: 'choose'; countries: Array<{ name: string; dialCode: string }> | null };

/**
 * Caller-ID (CLI) tests: request a test, list/inspect results, cancel, and read
 * quota + provider status.
 */
export class CliTestsResource {
  constructor(private readonly http: HttpClient) {}

  /** POST /cli-tests - request a new caller-ID test. */
  create(input: CliTestCreateInput, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/cli-tests', { ...opts, body: input });
  }

  /** GET /cli-tests - list the caller's tests (cursor-paginated). */
  list(filters: Partial<CliTestFilterInput> = {}, opts?: RequestOptions): Promise<Page<Record<string, unknown>>> {
    return this.http.page('/cli-tests', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /** GET /cli-tests/:id - test detail. */
  get(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', `/cli-tests/${encodeURIComponent(id)}`, opts);
  }

  /** POST /cli-tests/:id/cancel - cancel a not-yet-run test. */
  cancel(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', `/cli-tests/${encodeURIComponent(id)}/cancel`, opts);
  }

  /** GET /cli-tests/quota - per-test cost + remaining hourly quota. */
  quota(opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', '/cli-tests/quota', opts);
  }

  /**
   * GET /cli-tests/quote - what one caller-ID test on a route would cost now, which funds
   * pay for it and whether it can run. A route that cannot be tested is not an error:
   * `canRun` is false and `reason` says why.
   */
  quote(routeId: string, opts?: RequestOptions): Promise<CliTestQuote> {
    return this.http.request<CliTestQuote>('GET', '/cli-tests/quote', { ...opts, query: { routeId, ...opts?.query } });
  }

  /**
   * GET /cli-tests/routes/:routeId/test-countries - the countries a test on this route can
   * call. Pass the chosen name as `testCountry` when creating the test.
   */
  testCountries(routeId: string, opts?: RequestOptions): Promise<CliTestCountries> {
    return this.http.request<CliTestCountries>(
      'GET',
      `/cli-tests/routes/${encodeURIComponent(routeId)}/test-countries`,
      opts,
    );
  }

  // ── Route liveness tests ("test these N routes") ───────────────────────────
  // One real test call per route to a handset in its country. Each route is charged
  // the test price ONLY if it rang; routes that do not ring cost nothing.

  /** POST /cli-tests/batches/preview - what a route test would do and cost. Writes nothing. */
  previewBatch(routeIds: string[], opts?: RequestOptions): Promise<RouteTestPreview> {
    return this.http.request<RouteTestPreview>('POST', '/cli-tests/batches/preview', { ...opts, body: { routeIds } });
  }

  /** POST /cli-tests/batches - start a route test. Poll `getBatch` while `active` is true. */
  createBatch(input: RouteTestBatchInput, opts?: RequestOptions): Promise<RouteTestBatch> {
    return this.http.request<RouteTestBatch>('POST', '/cli-tests/batches', { ...opts, body: input });
  }

  /** GET /cli-tests/batches - your route tests, newest first (limit 1-50, default 20). */
  listBatches(params: { limit?: number } = {}, opts?: RequestOptions): Promise<RouteTestBatch[]> {
    return this.http.request<RouteTestBatch[]>('GET', '/cli-tests/batches', { ...opts, query: { ...params, ...opts?.query } });
  }

  /** GET /cli-tests/batches/:id - live per-route status and results. */
  getBatch(id: string, opts?: RequestOptions): Promise<RouteTestBatch> {
    return this.http.request<RouteTestBatch>('GET', `/cli-tests/batches/${encodeURIComponent(id)}`, opts);
  }

  /** POST /cli-tests/batches/:id/cancel - cancel every route not yet called (never charged). */
  cancelBatch(id: string, opts?: RequestOptions): Promise<RouteTestBatch> {
    return this.http.request<RouteTestBatch>('POST', `/cli-tests/batches/${encodeURIComponent(id)}/cancel`, opts);
  }

  /** GET /cli-tests/provider-status - whether caller-ID testing is available. */
  providerStatus(opts?: RequestOptions) {
    return this.http.request<{ enabled: boolean }>('GET', '/cli-tests/provider-status', opts);
  }
}
