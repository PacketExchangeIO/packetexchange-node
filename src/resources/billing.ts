import type { HttpClient, Page, RequestOptions } from '../http.js';

/** Filters for the transactions ledger. */
export interface TransactionFilters {
  type?: 'topup' | 'charge' | 'credit' | 'payout' | 'platform_fee' | 'test_credit';
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
}

/** Filters for the CDR/MDR list and export. */
export interface CdrFilters {
  from?: string;
  to?: string;
  kind?: 'voice' | 'sms';
  direction?: 'outbound' | 'inbound';
  cursor?: string;
  limit?: number;
}

/**
 * Billing & usage: spending summary, transaction ledger, balance history, and
 * call/message detail records (CDRs) with a streaming CSV export.
 */
export class BillingResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /billing/summary - dashboard spend/earnings/balance summary. */
  summary(opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', '/billing/summary', opts);
  }

  /** GET /billing/transactions - ledger history (cursor-paginated). */
  transactions(filters: TransactionFilters = {}, opts?: RequestOptions): Promise<Page<Record<string, unknown>>> {
    return this.http.page('/billing/transactions', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /** GET /billing/balance-history?days= - running balance over time. */
  balanceHistory(days = 30, opts?: RequestOptions) {
    return this.http.request<{
      points: Array<{ date: string; balance: number }>;
      currentBalance: number;
      hasData: boolean;
    }>('GET', '/billing/balance-history', { ...opts, query: { days, ...opts?.query } });
  }

  /** GET /billing/cdrs - call/message detail records (cursor-paginated). */
  cdrs(filters: CdrFilters = {}, opts?: RequestOptions): Promise<Page<Record<string, unknown>>> {
    return this.http.page('/billing/cdrs', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /**
   * GET /billing/cdrs/export - streamed CSV of CDRs in a date range. Returns the
   * raw `Response` so callers can stream the body themselves (the endpoint does
   * not use the JSON envelope). Throws on a non-2xx status.
   */
  async exportCdrs(
    range: { from?: string; to?: string; kind?: 'voice' | 'sms'; direction?: 'outbound' | 'inbound' } = {},
    opts?: RequestOptions,
  ): Promise<Response> {
    return this.http.requestRaw('GET', '/billing/cdrs/export', { ...opts, query: { ...range, ...opts?.query } });
  }
}
