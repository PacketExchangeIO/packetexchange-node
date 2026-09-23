import type { HttpClient, RequestOptions } from '../http.js';
import type { RoutingStrategy } from './routes.js';

/** Delivery channel for a verification code. */
export type VerifyChannel = 'sms' | 'voice';

/**
 * Languages a verification message can be sent in. SMS supports every one of these;
 * voice supports all except `ar` (the voice is text-to-speech and Arabic is not offered
 * reliably yet, so the API refuses it rather than speaking it badly).
 */
export type VerifyLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'hi' | 'ar';

/** Params for `verify.start`. */
export interface VerifyStartParams {
  /** Destination number (E.164). */
  to: string;
  channel: VerifyChannel;
  /** Code length, 4-10 digits (default 6). */
  length?: number;
  /** Message language (default `en`). */
  language?: VerifyLanguage;
  /** Name used in the message, e.g. "Your {brand} verification code is". Max 30 characters. Defaults to your company name. */
  brand?: string;
  /** How long the code stays valid, 60-3600 seconds (default 600). */
  expirySeconds?: number;
  /** SMS sender ID (channel `sms`) or caller ID in E.164 (channel `voice`). */
  from?: string;
  strategy?: RoutingStrategy;
}

/** Result of `verify.start`. The code itself is never returned on a live key. */
export interface VerifyStartResult {
  verificationId: string;
  to: string;
  channel: VerifyChannel;
  status: 'pending';
  expiresAt: string;
  maxAttempts: number;
  /** The callId (voice) or messageId (SMS) of the delivery. */
  sendRef: string;
  sendStatus: string;
  simulated?: boolean;
  /**
   * Test keys only: the code that WOULD have been sent, so a sandbox integration can
   * complete `verify.check` end to end. Never present on a live key.
   */
  testCode?: string;
  createdAt: string;
  [k: string]: unknown;
}

/** Params for `verify.check`. */
export interface VerifyCheckParams {
  verificationId: string;
  code: string;
}

/**
 * Result of `verify.check`. Only `approved` means the user proved they hold the
 * number. A verification approves once: a second check of the same id is `denied`
 * with reason `already_used`.
 */
export interface VerifyCheckResult {
  verificationId: string;
  status: 'approved' | 'denied' | 'expired' | 'max_attempts';
  attemptsRemaining: number;
  reason?: 'wrong_code' | 'already_used' | 'not_pending';
  [k: string]: unknown;
}

/** A verification as returned by `verify.get`. */
export interface Verification {
  verificationId: string;
  to: string;
  channel: VerifyChannel;
  status: 'pending' | 'approved' | 'expired' | 'max_attempts' | 'failed';
  attempts: number;
  maxAttempts: number;
  expiresAt: string;
  createdAt: string;
  approvedAt: string | null;
  sendRef: string | null;
  sendStatus: string | null;
  simulated?: boolean;
  [k: string]: unknown;
}

/**
 * Verify API: send a one-time code by SMS or voice call, then check what the user
 * typed. The platform generates the code, stores only a keyed hash of it, enforces
 * expiry, 5 attempts and single use, and rate-limits sends per number and per account.
 * All methods need the `verify:write` scope.
 */
export class VerifyResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * POST /verify/start - create a verification and send the code.
   * Rate limited: at most 5 starts per number per hour, a 30 second resend cooldown and
   * a daily cap per account (a `PacketExchangeError` with status 429 and code
   * `RATE_LIMITED`; `details.retryAfterSeconds` says when to retry).
   */
  start(params: VerifyStartParams, opts?: { idempotencyKey?: string } & RequestOptions): Promise<VerifyStartResult> {
    return this.http.request<VerifyStartResult>('POST', '/verify/start', {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey,
    });
  }

  /** POST /verify/check - check a code the user entered. */
  check(params: VerifyCheckParams, opts?: RequestOptions): Promise<VerifyCheckResult> {
    return this.http.request<VerifyCheckResult>('POST', '/verify/check', { ...opts, body: params });
  }

  /** GET /verify/:id - current state of a verification (never includes the code). */
  get(verificationId: string, opts?: RequestOptions): Promise<Verification> {
    return this.http.request<Verification>('GET', `/verify/${encodeURIComponent(verificationId)}`, opts);
  }
}
