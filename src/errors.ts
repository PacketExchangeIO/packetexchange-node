/**
 * The single error type the SDK throws for any failed request.
 *
 * Why a dedicated class (rather than re-throwing the raw envelope): callers can
 * `catch (e) { if (e instanceof PacketExchangeError) ... }` and branch on a
 * stable, typed `code`/`status` instead of string-matching message text. We
 * carry both the API's symbolic `code` (e.g. VALIDATION_ERROR, RATE_LIMITED)
 * and the HTTP `status`, plus any structured `details` the API attached.
 */
export class PacketExchangeError extends Error {
  /** Symbolic error code from the API envelope (e.g. `RATE_LIMITED`), or a
   *  synthetic one (`HTTP_500`, `NETWORK_ERROR`) when the body had none. */
  readonly code: string;
  /** HTTP status code (0 for a transport/network failure before a response). */
  readonly status: number;
  /**
   * Structured detail payload. For `VALIDATION_ERROR` this is an array of
   * `{ path, message }` (one per failing field); a few codes attach an object.
   */
  readonly details?: unknown;
  /**
   * The `X-Request-Id` response header (a UUID), when the API answered. Quote it to
   * support: it matches the server log and audit entry for this exact request.
   * Undefined for transport failures, where no response arrived.
   */
  readonly requestId?: string;

  constructor(args: { code: string; message: string; status: number; details?: unknown; requestId?: string }) {
    super(args.message);
    this.name = 'PacketExchangeError';
    this.code = args.code;
    this.status = args.status;
    this.details = args.details;
    this.requestId = args.requestId;
    // Restore the prototype chain so `instanceof` works after transpilation.
    Object.setPrototypeOf(this, PacketExchangeError.prototype);
  }

  /** Convenience: true for 401/403 (bad, missing, or under-scoped credential). */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** Convenience: true for HTTP 429 (slow down and retry). */
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}
