import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { Webhook, WebhookWithSecret, WebhookDelivery } from '../generated/schemas.js';

/**
 * Subscribable webhook event names, derived from the generated `Webhook` schema so the
 * union always matches the API's event catalogue. `ping` is sent only by the test
 * endpoint.
 */
export type WebhookEvent = Webhook['events'][number];

export interface WebhookCreateInput {
  /** HTTPS endpoint to deliver events to (must resolve to a public address). */
  url: string;
  /** At least one event to subscribe to. */
  events: WebhookEvent[];
}

export interface WebhookUpdateInput {
  url?: string;
  events?: WebhookEvent[];
  isActive?: boolean;
}

/** Delivery states as the API reports them. */
export type WebhookDeliveryStatus = WebhookDelivery['status'];

/** Filters for the account-wide delivery list. */
export interface WebhookDeliveryFilters {
  /** Only deliveries to this endpoint. */
  webhookId?: string;
  status?: WebhookDeliveryStatus;
  /** Only this event name, e.g. `call.completed`. */
  event?: string;
  /** The `nextCursor` from the previous page. */
  cursor?: string;
  /** Page size, 1-100 (default 20). */
  limit?: number;
}

/** One delivery with the exact JSON body that was (or will be) POSTed. */
export type WebhookDeliveryDetail = WebhookDelivery & { payload: Record<string, unknown> };

/**
 * Outbound webhook management (mounted under /account/webhooks). Create and
 * rotate-secret return the signing secret ONCE. Creating, editing, deleting and
 * rotating need a dashboard session; listing, testing, reading deliveries and
 * resending work with an API key.
 */
export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /account/webhooks - list endpoints (secret redacted to its last 4). */
  list(opts?: RequestOptions): Promise<Webhook[]> {
    return this.http.request<Webhook[]>('GET', '/account/webhooks', opts);
  }

  /** POST /account/webhooks - create an endpoint; `secret` is returned once. */
  create(input: WebhookCreateInput, opts?: RequestOptions): Promise<WebhookWithSecret> {
    return this.http.request<WebhookWithSecret>('POST', '/account/webhooks', { ...opts, body: input });
  }

  /** PATCH /account/webhooks/:id - update url / events / isActive (secret kept). */
  update(id: string, input: WebhookUpdateInput, opts?: RequestOptions): Promise<Webhook> {
    return this.http.request<Webhook>('PATCH', `/account/webhooks/${encodeURIComponent(id)}`, { ...opts, body: input });
  }

  /** DELETE /account/webhooks/:id - remove an endpoint and its history. */
  delete(id: string, opts?: RequestOptions): Promise<{ id: string; deleted: true }> {
    return this.http.request<{ id: string; deleted: true }>(
      'DELETE',
      `/account/webhooks/${encodeURIComponent(id)}`,
      opts,
    );
  }

  /** POST /account/webhooks/:id/rotate-secret - new signing secret, returned once. */
  rotateSecret(id: string, opts?: RequestOptions): Promise<WebhookWithSecret & { message: string }> {
    return this.http.request<WebhookWithSecret & { message: string }>(
      'POST',
      `/account/webhooks/${encodeURIComponent(id)}/rotate-secret`,
      opts,
    );
  }

  /** POST /account/webhooks/:id/test - enqueue a signed `ping` delivery. */
  test(id: string, opts?: RequestOptions): Promise<{ id: string; status: WebhookDeliveryStatus; event: 'ping' }> {
    return this.http.request('POST', `/account/webhooks/${encodeURIComponent(id)}/test`, opts);
  }

  /** GET /account/webhooks/:id/deliveries - one endpoint's delivery attempts (paginated). */
  deliveries(
    id: string,
    filters: { cursor?: string; limit?: number } = {},
    opts?: RequestOptions,
  ): Promise<Page<WebhookDelivery>> {
    return this.http.page<WebhookDelivery>(`/account/webhooks/${encodeURIComponent(id)}/deliveries`, {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /** GET /account/webhooks/deliveries - deliveries across ALL your endpoints (paginated). */
  listAllDeliveries(filters: WebhookDeliveryFilters = {}, opts?: RequestOptions): Promise<Page<WebhookDelivery>> {
    return this.http.page<WebhookDelivery>('/account/webhooks/deliveries', {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /** Async-iterate every delivery across all pages of the account-wide list. */
  iterateDeliveries(filters: WebhookDeliveryFilters = {}, opts?: RequestOptions): AsyncGenerator<WebhookDelivery> {
    return this.http.paginate<WebhookDelivery>('/account/webhooks/deliveries', {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /** GET /account/webhooks/deliveries/:deliveryId - one delivery with its payload. */
  getDelivery(deliveryId: string, opts?: RequestOptions): Promise<WebhookDeliveryDetail> {
    return this.http.request<WebhookDeliveryDetail>(
      'GET',
      `/account/webhooks/deliveries/${encodeURIComponent(deliveryId)}`,
      opts,
    );
  }

  /**
   * POST /account/webhooks/deliveries/:deliveryId/resend - queue a NEW delivery with
   * the same event and payload, signed with a fresh timestamp. The original is left
   * as it was. The new delivery has its own id, so de-duplicate on your event data.
   */
  resendDelivery(deliveryId: string, opts?: RequestOptions): Promise<WebhookDelivery> {
    return this.http.request<WebhookDelivery>(
      'POST',
      `/account/webhooks/deliveries/${encodeURIComponent(deliveryId)}/resend`,
      opts,
    );
  }
}

