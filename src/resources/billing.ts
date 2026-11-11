import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { Money } from '../generated/schemas.js';

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

/** Daily seller earnings, from `billing.earnings()`. Money fields are 6-decimal USD strings. */
export interface SellerEarnings {
  window: number;
  /** One point per UTC day, oldest first, zero-filled. */
  points: Array<{ date: string; credits: Money }>;
  total: Money;
  hasData: boolean;
  windows: { today: Money; last7d: Money; last30d: Money };
}

/** When held money becomes withdrawable, from `billing.holdSchedule()`. */
export interface HoldSchedule {
  /** Card top-ups still inside the chargeback window, and any customer-funded balance (`releasesAt: null`, never withdrawable). */
  entries: Array<{ amount: Money; releasesAt: string | null; source: 'card' | 'customer_funds' }>;
  balance: Money;
  held: Money;
  withdrawable: Money;
  holdDays: number;
}

/** Your failed calls grouped into plain-English reasons, from `billing.failureSummary()`. */
export interface CallFailureSummary {
  days: number;
  since: string;
  /** Voice attempts in the window. */
  calls: number;
  failed: number;
  /** Largest first. */
  rows: Array<{
    key: string;
    /** Whose move it is. */
    who: 'you' | 'route' | 'destination' | 'platform' | 'unknown';
    title: string;
    explanation: string;
    fix?: { label: string; href: string };
    count: number;
    share: number;
  }>;
}

/** Details of the current A-Z price list workbook, from `billing.priceListInfo()`. */
export interface PriceListInfo {
  /** The day the list is for, YYYY-MM-DD (UTC). */
  day: string;
  generatedAt: string;
  /** Workbook size in bytes. */
  fileSize: number;
  /** Row counts by section, e.g. `total`, `cli`, `ncli`, `sms` and `changes`. */
  rowCounts: Record<string, number>;
  /** True when the list can be downloaded without signing in. */
  public: boolean;
  /** Downloads allowed per account in any 24 hours. */
  dailyLimit: number;
}

/**
 * Billing & usage: spending summary, transaction ledger, balance history, and
 * call/message detail records (CDRs) with a streaming CSV export, seller earnings,
 * and the A-Z price list.
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

  /** GET /billing/cdrs/failure-summary - top reasons your calls failed over the last `days` (1-31, default 7). */
  failureSummary(params: { days?: number } = {}, opts?: RequestOptions): Promise<CallFailureSummary> {
    return this.http.request<CallFailureSummary>('GET', '/billing/cdrs/failure-summary', {
      ...opts,
      query: { ...params, ...opts?.query },
    });
  }

  /** GET /billing/earnings - seller earnings per UTC day over the last `window` days (1-90, default 30). */
  earnings(params: { window?: number } = {}, opts?: RequestOptions): Promise<SellerEarnings> {
    return this.http.request<SellerEarnings>('GET', '/billing/earnings', { ...opts, query: { ...params, ...opts?.query } });
  }

  /** GET /billing/hold-schedule - when held money becomes withdrawable, with balance, held and withdrawable totals. */
  holdSchedule(opts?: RequestOptions): Promise<HoldSchedule> {
    return this.http.request<HoldSchedule>('GET', '/billing/hold-schedule', opts);
  }

  /**
   * GET /price-list.xlsx - today's A-Z marketplace price list as Excel workbook bytes.
   * Downloads per account are limited per 24 hours (see `priceListInfo`); the API answers
   * 404 while the list is still being prepared.
   */
  priceList(opts?: RequestOptions): Promise<Uint8Array> {
    return this.http.requestBytes('GET', '/price-list.xlsx', opts);
  }

  /** GET /price-list/me.xlsx - the same workbook with your private prices and accepted offers applied. */
  myPriceList(opts?: RequestOptions): Promise<Uint8Array> {
    return this.http.requestBytes('GET', '/price-list/me.xlsx', opts);
  }

  /** GET /price-list/meta - details of the current price list, or `null` before one has been built. */
  priceListInfo(opts?: RequestOptions): Promise<PriceListInfo | null> {
    return this.http.request<PriceListInfo | null>('GET', '/price-list/meta', opts);
  }
}
