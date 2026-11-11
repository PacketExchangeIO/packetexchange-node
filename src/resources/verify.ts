import type { HttpClient, RequestOptions } from '../http.js';
import type { RoutingStrategy } from './routes.js';
import type { CallInCoverage, CallInNumber, CallInVerification } from '../generated/schemas.js';

/** Delivery channel for a verification code. */
export type VerifyChannel = 'sms' | 'voice';

/**
 * Languages a verification message can be sent in. SMS supports every one of these;
 * voice supports all except `ar` (the voice is text-to-speech and Arabic is not offered
 * reliably yet, so the API refuses it rather than speaking it badly).
 */
export type VerifyLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'hi' | 'ar';

/** Params for `verify.start` with a code sent by SMS or voice. */
export interface VerifyStartParams {
  /** Destination number (E.164). */
  to: string;
  channel: VerifyChannel;
  /**
   * Your own id for this request (letters, digits and `. _ : @ -`, max 128), e.g. your user
   * or session id. Echoed on every read and webhook.
   */
  reference?: string;
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

/**
 * Params for `verify.start` with `channel: 'call_in'`. No code is sent: the result carries
 * `callNumber`, and the user verifies by calling it from `to`. Needs one of your own phone
 * numbers switched on for call-in in the same country (see `verify.callIn`).
 */
export interface VerifyCallInStartParams {
  /** The phone number being verified (E.164). */
  to: string;
  channel: 'call_in';
  /** Your own id for this request. Starting again with the same reference returns the pending verification. */
  reference?: string;
  /** How long the user has to call, 60-3600 seconds (default 300 for call-in). */
  expirySeconds?: number;
}

/** Result of `verify.start`. The code itself is never returned on a live key. */
export interface VerifyStartResult {
  verificationId: string;
  /** Your reference, when you sent one. */
  reference?: string | null;
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
  /** Your reference, when you sent one. */
  reference?: string | null;
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

/** Filters for `verify.list`. */
export interface VerifyListFilters {
  reference?: string;
  status?: 'pending' | 'approved' | 'expired' | 'max_attempts' | 'failed';
  channel?: VerifyChannel | 'call_in';
  /** 1-100, default 25. */
  limit?: number;
}

/**
 * Verify API: send a one-time code by SMS or voice call, then check what the user
 * typed. The platform generates the code, stores only a keyed hash of it, enforces
 * expiry, 5 attempts and single use, and rate-limits sends per number and per account.
 * Call-in verification (`channel: 'call_in'`) instead has the user call one of your
 * numbers from the phone being verified. All methods need the `verify:write` scope.
 */
export class VerifyResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * POST /verify/start - create a verification and send the code.
   * Rate limited: at most 5 starts per number per hour, a 30 second resend cooldown and
   * a daily cap per account (a `PacketExchangeError` with status 429 and code
   * `RATE_LIMITED`; `details.retryAfterSeconds` says when to retry).
   */
  start(params: VerifyStartParams, opts?: RequestOptions): Promise<VerifyStartResult>;
  /**
   * POST /verify/start with `channel: 'call_in'` - returns the number the user must call
   * from `to`. Learn the result from the `verification.approved` webhook or `verify.get`.
   * A flat fee is charged per approved verification; an expired one is free.
   */
  start(params: VerifyCallInStartParams, opts?: RequestOptions): Promise<CallInVerification>;
  start(
    params: VerifyStartParams | VerifyCallInStartParams,
    opts?: RequestOptions,
  ): Promise<VerifyStartResult | CallInVerification> {
    return this.http.request<VerifyStartResult | CallInVerification>('POST', '/verify/start', {
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
  get(verificationId: string, opts?: RequestOptions): Promise<Verification | CallInVerification> {
    return this.http.request<Verification | CallInVerification>(
      'GET',
      `/verify/${encodeURIComponent(verificationId)}`,
      opts,
    );
  }

  /**
   * GET /verify - recent verifications, newest first. Test keys see only test
   * verifications, live keys only live ones.
   */
  list(filters: VerifyListFilters = {}, opts?: RequestOptions): Promise<Array<Verification | CallInVerification>> {
    return this.http.request<Array<Verification | CallInVerification>>('GET', '/verify', {
      ...opts,
      query: { ...filters, ...opts?.query },
    });
  }

  /**
   * POST /verify/:id/simulate-call - test keys only: approve a pending call-in
   * verification as if the user had called, and send the `verification.approved` webhook
   * with `simulated: true`. Nothing is charged.
   */
  simulateCall(verificationId: string, opts?: RequestOptions): Promise<CallInVerification> {
    return this.http.request<CallInVerification>(
      'POST',
      `/verify/${encodeURIComponent(verificationId)}/simulate-call`,
      opts,
    );
  }

  /**
   * Call-in numbers: your own phone numbers that answer call-in verifications. While
   * call-in is on for a number, every call to it is treated as a verification attempt and
   * ended without being answered, so any ringing set up on it stops.
   */
  readonly callIn = {
    /** GET /verify/call-in/coverage - the call-in numbers you can use, the dial code each verifies, and the price. */
    coverage: (opts?: RequestOptions): Promise<CallInCoverage> =>
      this.http.request<CallInCoverage>('GET', '/verify/call-in/coverage', opts),
    /** GET /verify/call-in/numbers - every phone number on your account and its call-in setting. */
    listNumbers: (opts?: RequestOptions): Promise<CallInNumber[]> =>
      this.http.request<CallInNumber[]>('GET', '/verify/call-in/numbers', opts),
    /** POST /verify/call-in/numbers - switch call-in on for an active number you hold. Needs a live key. */
    addNumber: (phoneNumberId: string, opts?: RequestOptions): Promise<CallInNumber> =>
      this.http.request<CallInNumber>('POST', '/verify/call-in/numbers', { ...opts, body: { phoneNumberId } }),
    /** DELETE /verify/call-in/numbers/:phoneNumberId - switch call-in off; calls ring as set up again. Needs a live key. */
    removeNumber: (phoneNumberId: string, opts?: RequestOptions): Promise<CallInNumber | null> =>
      this.http.request<CallInNumber | null>(
        'DELETE',
        `/verify/call-in/numbers/${encodeURIComponent(phoneNumberId)}`,
        opts,
      ),
  };
}
