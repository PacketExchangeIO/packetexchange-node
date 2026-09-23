import type { HttpClient, RequestOptions } from '../http.js';
import type {
  OfferCreateInput,
  OfferBulkInput,
  OfferActionInput,
  OfferGroupActionInput,
} from '../shared-types.js';

/** Which side of an offer to list. */
export type OfferRole = 'buyer' | 'seller' | 'all';

/**
 * Price negotiations (offers): open single or bulk offers, list by role, act on
 * an offer (counter/accept/reject/withdraw), and manage bulk offer groups.
 */
export class OffersResource {
  constructor(private readonly http: HttpClient) {}

  /** POST /offers - open a negotiation on a route. */
  create(input: OfferCreateInput, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/offers', { ...opts, body: input });
  }

  /** POST /offers/bulk - one offer across many routes (creates a group). */
  bulk(input: OfferBulkInput, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/offers/bulk', { ...opts, body: input });
  }

  /** GET /offers?role= - list offers from the buyer's or seller's perspective. */
  list(role: OfferRole = 'all', filters: { status?: string } = {}, opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/offers', {
      ...opts,
      query: { role, ...filters, ...opts?.query },
    });
  }

  /** GET /offers/:id - offer detail. */
  get(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', `/offers/${encodeURIComponent(id)}`, opts);
  }

  /** PATCH /offers/:id - counter / accept / reject / withdraw. */
  act(id: string, input: OfferActionInput, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>(
      'PATCH',
      `/offers/${encodeURIComponent(id)}`,
      { ...opts, body: input },
    );
  }

  /** GET /offers/groups - the caller's bulk offer groups. */
  groups(opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/offers/groups', opts);
  }

  /** POST /offers/groups/:id/respond - seller accepts/rejects a whole group. */
  respondGroup(id: string, input: OfferGroupActionInput, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', `/offers/groups/${encodeURIComponent(id)}/respond`, {
      ...opts,
      body: input,
    });
  }
}
