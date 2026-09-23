import type { HttpClient, Page, RequestOptions } from '../http.js';
import type {
  DialerCampaign,
  DialerCampaignCreateInput,
  DialerCampaignUpdateInput,
  DialerCampaignFilterInput,
  DialerNumbersFilterInput,
  DialerNumber,
  DialerCli,
  DialerCampaignStats,
} from '../shared-types.js';

/** Start/pause/stop a campaign. */
export type DialerAction = 'start' | 'pause' | 'stop';

/**
 * Predictive dialer: campaign CRUD + lifecycle control, number/CLI lists, and
 * per-campaign stats. State-changing methods require the `dialer:write` scope.
 */
export class DialerResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /dialer/campaigns - list campaigns (cursor-paginated). */
  listCampaigns(
    filters: Partial<DialerCampaignFilterInput> = {},
    opts?: RequestOptions,
  ): Promise<Page<DialerCampaign>> {
    return this.http.page<DialerCampaign>('/dialer/campaigns', {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /** POST /dialer/campaigns - create a campaign (scope: dialer:write). */
  createCampaign(input: DialerCampaignCreateInput, opts?: RequestOptions): Promise<DialerCampaign> {
    return this.http.request<DialerCampaign>('POST', '/dialer/campaigns', { ...opts, body: input });
  }

  /** GET /dialer/campaigns/:id - campaign detail. */
  getCampaign(id: string, opts?: RequestOptions): Promise<DialerCampaign> {
    return this.http.request<DialerCampaign>('GET', `/dialer/campaigns/${encodeURIComponent(id)}`, opts);
  }

  /** PUT /dialer/campaigns/:id - update a campaign (scope: dialer:write). */
  updateCampaign(id: string, input: DialerCampaignUpdateInput, opts?: RequestOptions): Promise<DialerCampaign> {
    return this.http.request<DialerCampaign>(
      'PUT',
      `/dialer/campaigns/${encodeURIComponent(id)}`,
      { ...opts, body: input },
    );
  }

  /** DELETE /dialer/campaigns/:id - delete a campaign (scope: dialer:write). */
  deleteCampaign(id: string, opts?: RequestOptions) {
    return this.http.request<{ message: string }>('DELETE', `/dialer/campaigns/${encodeURIComponent(id)}`, opts);
  }

  /** POST /dialer/campaigns/:id/control - start/pause/stop (scope: dialer:write). */
  control(id: string, action: DialerAction, opts?: RequestOptions): Promise<DialerCampaign> {
    return this.http.request<DialerCampaign>('POST', `/dialer/campaigns/${encodeURIComponent(id)}/control`, {
      ...opts,
      body: { action },
    });
  }

  /** GET /dialer/campaigns/:id/stats - campaign stats. */
  stats(id: string, opts?: RequestOptions): Promise<DialerCampaignStats> {
    return this.http.request<DialerCampaignStats>('GET', `/dialer/campaigns/${encodeURIComponent(id)}/stats`, opts);
  }

  /** POST /dialer/campaigns/:id/numbers - upload dial numbers (scope: dialer:write). */
  uploadNumbers(id: string, numbers: string[], opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', `/dialer/campaigns/${encodeURIComponent(id)}/numbers`, {
      ...opts,
      body: { numbers },
    });
  }

  /** GET /dialer/campaigns/:id/numbers - list dial numbers (cursor-paginated). */
  listNumbers(
    id: string,
    filters: Partial<DialerNumbersFilterInput> = {},
    opts?: RequestOptions,
  ): Promise<Page<DialerNumber>> {
    return this.http.page<DialerNumber>(`/dialer/campaigns/${encodeURIComponent(id)}/numbers`, {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /** DELETE /dialer/campaigns/:id/numbers - clear all numbers (scope: dialer:write). */
  clearNumbers(id: string, opts?: RequestOptions) {
    return this.http.request<{ message: string }>(
      'DELETE',
      `/dialer/campaigns/${encodeURIComponent(id)}/numbers`,
      opts,
    );
  }

  /** POST /dialer/campaigns/:id/clis - upload caller IDs (scope: dialer:write). */
  uploadClis(id: string, clis: string[], opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', `/dialer/campaigns/${encodeURIComponent(id)}/clis`, {
      ...opts,
      body: { clis },
    });
  }

  /** GET /dialer/campaigns/:id/clis - list caller IDs. */
  listClis(id: string, opts?: RequestOptions): Promise<DialerCli[]> {
    return this.http.request<DialerCli[]>('GET', `/dialer/campaigns/${encodeURIComponent(id)}/clis`, opts);
  }

  /** DELETE /dialer/campaigns/:id/clis - clear all CLIs (scope: dialer:write). */
  clearClis(id: string, opts?: RequestOptions) {
    return this.http.request<{ message: string }>('DELETE', `/dialer/campaigns/${encodeURIComponent(id)}/clis`, opts);
  }
}
