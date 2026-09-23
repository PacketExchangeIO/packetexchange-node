import type { HttpClient, RequestOptions } from '../http.js';

/** Connectivity test type. */
export type InterconnectionTestType = 'sip_options' | 'test_call' | 'smpp_bind';

export interface TestConnectionParams {
  purchaseId: string;
  testType?: InterconnectionTestType;
  /** For `test_call`: the E.164 number to dial. */
  testNumber?: string;
  /** For `test_call`: caller ID to present. */
  testCli?: string;
}

/**
 * Interconnections: list connections, inspect one, run a live SIP/SMPP test,
 * read the health/status summary, and rotate a purchase's credentials.
 */
export class InterconnectionsResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /interconnections - all the caller's connections (with route/purchase). */
  list(opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/interconnections', opts);
  }

  /** GET /interconnections/:id - single connection detail. */
  get(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', `/interconnections/${encodeURIComponent(id)}`, opts);
  }

  /** GET /interconnections/status/summary - counts + SIP public IP. */
  statusSummary(opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', '/interconnections/status/summary', opts);
  }

  /** GET /interconnections/health - per-connection live bind/reachability state. */
  health(opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/interconnections/health', opts);
  }

  /** POST /interconnections/test - run a SIP/SMPP connectivity test. */
  test(params: TestConnectionParams, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/interconnections/test', { ...opts, body: params });
  }

  /** POST /interconnections/:purchaseId/rotate-credentials - issue fresh SIP/SMPP creds (returned once). */
  rotateCredentials(purchaseId: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>(
      'POST',
      `/interconnections/${encodeURIComponent(purchaseId)}/rotate-credentials`,
      opts,
    );
  }
}
