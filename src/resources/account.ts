import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { ApiUsage } from '../generated/schemas.js';
import type {
  User,
  ApiKey,
  ApiKeyCreateResult,
  ApiKeyCreateInput,
  ApiKeyUpdateInput,
} from '../shared-types.js';

/**
 * Account & developer self-service: profile, balance, API keys, alerts, API
 * usage analytics, and login sessions. Webhooks, favorites, and saved searches
 * live under their own top-level resource groups (`sdk.webhooks`, etc.) since
 * they're first-class developer surfaces, even though they mount under
 * `/account` on the wire.
 */
export class AccountResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /account - the caller's profile. */
  get(opts?: RequestOptions): Promise<User> {
    return this.http.request<User>('GET', '/account', opts);
  }

  /** PUT /account - update profile fields. */
  update(input: Record<string, unknown>, opts?: RequestOptions): Promise<User> {
    return this.http.request<User>('PUT', '/account', { ...opts, body: input });
  }

  /** GET /account/balance - current balance + test credit. */
  balance(opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', '/account/balance', opts);
  }

  /**
   * GET /account/api-usage - request volume, error rate, p95 latency, per-day counts
   * and top endpoints over a trailing window (1-90 days, default 7).
   *
   * Pass `keyId` to see ONE of your API keys; omit it for all account traffic,
   * dashboard sessions included. A bare number is still accepted as `days` so
   * 0.1.x call sites (`apiUsage(30)`) keep working.
   */
  apiUsage(params: number | { days?: number; keyId?: string } = {}, opts?: RequestOptions): Promise<ApiUsage> {
    const q = typeof params === 'number' ? { days: params } : params;
    return this.http.request<ApiUsage>('GET', '/account/api-usage', {
      ...opts,
      query: { days: q.days ?? 7, keyId: q.keyId, ...opts?.query },
    });
  }

  /** API key management (CRUD). All paths under /account/api-keys. */
  readonly apiKeys = {
    /** GET /account/api-keys - list keys (secrets redacted). */
    list: (opts?: RequestOptions): Promise<ApiKey[]> =>
      this.http.request<ApiKey[]>('GET', '/account/api-keys', opts),
    /** POST /account/api-keys - create a key. The plaintext secret is returned ONCE. */
    create: (input: ApiKeyCreateInput, opts?: RequestOptions): Promise<ApiKeyCreateResult> =>
      this.http.request<ApiKeyCreateResult>('POST', '/account/api-keys', { ...opts, body: input }),
    /** PATCH /account/api-keys/:id - relabel and/or tighten scopes. */
    update: (id: string, input: ApiKeyUpdateInput, opts?: RequestOptions): Promise<ApiKey> =>
      this.http.request<ApiKey>('PATCH', `/account/api-keys/${encodeURIComponent(id)}`, { ...opts, body: input }),
    /** DELETE /account/api-keys/:id - revoke a key. */
    revoke: (id: string, opts?: RequestOptions) =>
      this.http.request<{ message: string }>('DELETE', `/account/api-keys/${encodeURIComponent(id)}`, opts),
  };

  /** Spend-alert config. */
  readonly alerts = {
    /** GET /account/alerts - current alert thresholds. */
    get: (opts?: RequestOptions) => this.http.request<Record<string, unknown>>('GET', '/account/alerts', opts),
    /** PUT /account/alerts - upsert thresholds (null clears one). */
    set: (
      input: { lowBalanceThreshold?: number | null; dailySpendCap?: number | null; notifyEmail?: boolean },
      opts?: RequestOptions,
    ) => this.http.request<Record<string, unknown>>('PUT', '/account/alerts', { ...opts, body: input }),
  };

  /** Login sessions (mounted under /auth on the wire). */
  readonly sessions = {
    /** GET /auth/sessions - active sessions for the caller. */
    list: (opts?: RequestOptions) =>
      this.http.request<Array<Record<string, unknown>>>('GET', '/auth/sessions', opts),
    /** DELETE /auth/sessions/:id - revoke one session. */
    revoke: (id: string, opts?: RequestOptions) =>
      this.http.request<{ message?: string }>('DELETE', `/auth/sessions/${encodeURIComponent(id)}`, opts),
    /** POST /auth/sessions/revoke-others - revoke all sessions but the current. */
    revokeOthers: (opts?: RequestOptions) =>
      this.http.request<Record<string, unknown>>('POST', '/auth/sessions/revoke-others', opts),
  };
}
