import type { HttpClient, RequestOptions } from '../http.js';

/** Notifications: list and mark read. */
export class NotificationsResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /notifications - list notifications (+ unread count). */
  list(params: { unread?: boolean; limit?: number } = {}, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('GET', '/notifications', {
      ...opts,
      query: { unread: params.unread ? '1' : undefined, limit: params.limit, ...opts?.query },
    });
  }

  /** POST /notifications/:id/read - mark one notification read. */
  markRead(id: string, opts?: RequestOptions) {
    return this.http.request<unknown>('POST', `/notifications/${encodeURIComponent(id)}/read`, opts);
  }

  /** POST /notifications/read-all - mark all notifications read. */
  markAllRead(opts?: RequestOptions) {
    return this.http.request<unknown>('POST', '/notifications/read-all', opts);
  }
}

/** DNC / opt-out suppression management. */
export class DncResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /dnc - the caller's own + global suppression entries. */
  list(opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/dnc', opts);
  }

  /** POST /dnc - add a single number (idempotent). */
  add(phoneNumber: string, reason?: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/dnc', { ...opts, body: { phoneNumber, reason } });
  }

  /** POST /dnc/bulk - add many numbers at once (deduped). */
  addBulk(numbers: string[], opts?: RequestOptions) {
    return this.http.request<{ inserted: number; submitted: number }>('POST', '/dnc/bulk', {
      ...opts,
      body: { numbers },
    });
  }

  /** DELETE /dnc/:id - remove one of the caller's own entries. */
  remove(id: string, opts?: RequestOptions) {
    return this.http.request<unknown>('DELETE', `/dnc/${encodeURIComponent(id)}`, opts);
  }
}

/** Route favorites / watchlist (mounted under /account/favorites). */
export class FavoritesResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /account/favorites - favorited routes with summaries. */
  list(opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/account/favorites', opts);
  }

  /** POST /account/favorites - favorite a route (idempotent). */
  add(routeId: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/account/favorites', { ...opts, body: { routeId } });
  }

  /** DELETE /account/favorites/:routeId - unfavorite a route. */
  remove(routeId: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>(
      'DELETE',
      `/account/favorites/${encodeURIComponent(routeId)}`,
      opts,
    );
  }
}

/** Saved marketplace searches (mounted under /account/saved-searches). */
export class SavedSearchesResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /account/saved-searches - the caller's saved searches. */
  list(opts?: RequestOptions) {
    return this.http.request<Array<Record<string, unknown>>>('GET', '/account/saved-searches', opts);
  }

  /** POST /account/saved-searches - save a search (name + opaque filters object). */
  create(input: { name: string; filters: Record<string, unknown> }, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>('POST', '/account/saved-searches', { ...opts, body: input });
  }

  /** DELETE /account/saved-searches/:id - remove a saved search. */
  delete(id: string, opts?: RequestOptions) {
    return this.http.request<Record<string, unknown>>(
      'DELETE',
      `/account/saved-searches/${encodeURIComponent(id)}`,
      opts,
    );
  }
}
