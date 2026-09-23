import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { RoutingStrategy } from './routes.js';
import type {
  CallAction,
  CommsCallAccepted,
  CommsCallStatus,
  CommsSms,
  CommsSmsStatus,
} from '../generated/schemas.js';

export type { CallAction, CommsCallAccepted, CommsCallStatus, CommsSmsStatus };

/** Params for placing a single outbound call (`comms.call`). */
export interface CallParams {
  to: string;
  from: string;
  /** Pin a purchased route; omit for Smart Routing by `strategy`. */
  routeId?: string;
  strategy?: RoutingStrategy;
  /** Max call duration in seconds (10-3600, default 300). */
  maxDuration?: number;
  /**
   * Return as soon as the call is being dialled (HTTP 202, `status: 'ringing'`) instead
   * of waiting for it to end. Prefer `comms.callAsync()`, which sets this for you.
   */
  async?: boolean;
  /**
   * What the answered call does, in order: `{ say }`, `{ play }` (an https MP3 URL),
   * `{ gather: { digits, timeout } }`, `{ pause }` or `{ hangup: true }`. Up to 10.
   * The call ends when the actions finish. Test keys run no actions.
   */
  actions?: CallAction[];
  /** Default language for `say` actions: en, es, fr, de, pt or hi (default en). */
  language?: 'en' | 'es' | 'fr' | 'de' | 'pt' | 'hi';
}

/** Final call states: once `getCall` reports one of these, the call has ended. */
export const FINAL_CALL_STATUSES = ['completed', 'no_answer', 'busy', 'failed'] as const;

/** Params for sending a single SMS (`comms.sms`). The API field is `message`. */
export interface SmsParams {
  to: string;
  from: string;
  /** Message body (mapped to the API's `message` field). */
  body: string;
  routeId?: string;
  strategy?: RoutingStrategy;
}

/** Params for a bulk SMS send (`comms.smsBulk`). */
export interface SmsBulkParams {
  routeId: string;
  from: string;
  messages: Array<{ to: string; body: string }>;
}

/** Filters shared by the call/SMS history list endpoints. */
export interface CommsHistoryFilters {
  type?: 'api_call' | 'api_sms' | 'smpp_sms' | 'dialer_campaign';
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
}

export interface CallResult {
  callId?: string;
  status: string;
  durationSeconds?: number;
  cost: string;
  [k: string]: unknown;
}

/**
 * Result of `comms.sms`. `status` is the send-time outcome; the delivery outcome comes
 * later from `getSms` or the `sms.delivered` / `sms.failed` webhooks.
 */
export interface SmsResult {
  messageId?: string;
  status: string;
  cost: string;
  segments?: number;
  /**
   * The destination network the message was priced as, when the route prices SMS per
   * network (determined from the number's range); `null` otherwise.
   */
  network?: CommsSms['network'];
  [k: string]: unknown;
}

/** Languages a voice passcode can be spoken in (rendered by our text-to-speech provider). */
export type VoiceOtpLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'hi';

/**
 * Params for a voice passcode call (`comms.voiceOtp`). The platform places the call,
 * speaks the code digit by digit on answer, repeats it, then hangs up.
 */
export interface VoiceOtpParams {
  /** Destination number (E.164). */
  to: string;
  /** The code to speak, 4-10 digits. Omit and one is generated for you. */
  code?: string;
  /** Length of a generated code (4-10, default 6). Ignored when `code` is given. */
  length?: number;
  /** Spoken language (default `en`). */
  language?: VoiceOtpLanguage;
  /** How many times the code is spoken (1-3, default 2). */
  repeat?: number;
  /** Caller ID to present (E.164). Defaults to the platform caller ID when one is configured. */
  from?: string;
  strategy?: RoutingStrategy;
  /** Name spoken in "Your {brand} verification code is". Letters, digits and spaces, max 30. Defaults to your company name. */
  brand?: string;
  /**
   * Return a GENERATED code in the response. Off by default so a code is never echoed
   * unless you need it (for example to store it yourself); a code you supplied is never returned.
   */
  returnCode?: boolean;
}

/** Result of `comms.voiceOtp`. The call runs on after this returns; poll `getVoiceOtp` or use the `call.completed` webhook for the outcome. */
export interface VoiceOtpResult {
  voiceOtpId: string;
  callId: string;
  /** `initiated` for a live call that has been dialled; `accepted` for a test-key simulation. */
  status: 'initiated' | 'accepted';
  to: string;
  from: string;
  language: VoiceOtpLanguage;
  codeLength: number;
  repeat: number;
  /** Present only when PacketExchange generated the code AND `returnCode` was true. */
  code?: string;
  simulated?: boolean;
  /** Simulated cost on test keys; null on live calls until the call completes. */
  cost: string | null;
  createdAt: string;
  [k: string]: unknown;
}

/** Status of one voice passcode call (`comms.getVoiceOtp`). */
export interface VoiceOtpStatus {
  voiceOtpId: string;
  callId: string;
  status: 'initiated' | 'answered' | 'no_answer' | 'busy' | 'failed' | 'accepted';
  to: string;
  language: VoiceOtpLanguage;
  codeLength: number;
  cost: string | null;
  durationSeconds: number | null;
  createdAt: string;
  completedAt: string | null;
  simulated?: boolean;
  [k: string]: unknown;
}

/**
 * One-shot communications: place a call, send one or many SMS, and read call /
 * SMS history. Origination methods accept an optional `idempotencyKey`.
 */
export class CommsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * POST /comms/calls - place a single outbound call (scope: voice:send). Waits for the
   * call to end and resolves with its outcome and cost. To return as soon as the call
   * is dialled, use `callAsync`.
   */
  call(params: CallParams, opts?: { idempotencyKey?: string } & RequestOptions): Promise<CallResult> {
    return this.http.request<CallResult>('POST', '/comms/calls', {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey,
    });
  }

  /**
   * POST /comms/calls with `async: true` (scope: voice:send). Resolves as soon as the
   * call is being dialled, with its `callId` (HTTP 202). Follow the call with `getCall`,
   * `waitForCall` or the call.ringing, call.answered, call.gathered and call.completed
   * webhooks. A call that ends before it is dialled (a test-key simulation, for
   * example) resolves with the final `CallResult` instead.
   *
   * @example
   * const call = await px.comms.callAsync({
   *   to: '+447700900123',
   *   from: '+14155550100',
   *   actions: [
   *     { say: 'Your appointment is tomorrow at 10am. Press 1 to confirm or 2 to cancel.' },
   *     { gather: { digits: 1, timeout: 5 } },
   *   ],
   * });
   */
  callAsync(
    params: Omit<CallParams, 'async'>,
    opts?: { idempotencyKey?: string } & RequestOptions,
  ): Promise<CommsCallAccepted | CallResult> {
    return this.http.request<CommsCallAccepted | CallResult>('POST', '/comms/calls', {
      ...opts,
      body: { ...params, async: true },
      idempotencyKey: opts?.idempotencyKey,
    });
  }

  /**
   * GET /comms/calls/:id - live status, timestamps, cost, hangup reason and gathered
   * digits for one call (scope: voice:send). Gathered digits are filled in when the
   * call ends.
   */
  getCall(callId: string, opts?: RequestOptions): Promise<CommsCallStatus> {
    return this.http.request<CommsCallStatus>('GET', `/comms/calls/${encodeURIComponent(callId)}`, opts);
  }

  /**
   * Poll `getCall` until the call reaches a final state (see `FINAL_CALL_STATUSES`) or
   * `timeoutMs` passes (default 10 minutes), then resolve with the last status read.
   * Polls every `intervalMs` (default 2000, minimum 1000). For production services the
   * call webhooks avoid polling altogether.
   */
  async waitForCall(
    callId: string,
    options: { timeoutMs?: number; intervalMs?: number } = {},
    opts?: RequestOptions,
  ): Promise<CommsCallStatus> {
    const deadline = Date.now() + (options.timeoutMs ?? 10 * 60_000);
    const interval = Math.max(1000, options.intervalMs ?? 2000);
    for (;;) {
      const status = await this.getCall(callId, opts);
      const done = (FINAL_CALL_STATUSES as readonly string[]).includes(status.status);
      if (done || Date.now() + interval > deadline) return status;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  /** POST /comms/sms - send a single SMS (scope: sms:send). */
  sms(params: SmsParams, opts?: { idempotencyKey?: string } & RequestOptions): Promise<SmsResult> {
    const { body, ...rest } = params;
    return this.http.request<SmsResult>('POST', '/comms/sms', {
      ...opts,
      // The API expects `message`, the SDK exposes the friendlier `body`.
      body: { ...rest, message: body },
      idempotencyKey: opts?.idempotencyKey,
    });
  }

  /** POST /comms/sms/bulk - batch SMS over one route (scope: sms:send). */
  smsBulk(params: SmsBulkParams, opts?: RequestOptions) {
    return this.http.request<{
      total: number;
      sent: number;
      failed: number;
      totalCost: string;
      results: Array<Record<string, unknown>>;
    }>('POST', '/comms/sms/bulk', {
      ...opts,
      // Map each item's `body` → `message` to match the API schema.
      body: {
        routeId: params.routeId,
        from: params.from,
        messages: params.messages.map((m) => ({ to: m.to, message: m.body })),
      },
    });
  }

  /** GET /comms/calls - paginated call history. */
  listCalls(filters: CommsHistoryFilters = {}, opts?: RequestOptions): Promise<Page<Record<string, unknown>>> {
    return this.http.page('/comms/calls', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /** GET /comms/sms - paginated SMS history. */
  listSms(filters: CommsHistoryFilters = {}, opts?: RequestOptions): Promise<Page<Record<string, unknown>>> {
    return this.http.page('/comms/sms', { ...opts, query: { ...filters, ...opts?.query } });
  }

  /**
   * POST /comms/voice-otp - call a number and speak a one-time passcode (scope: voice:send).
   * Returns once the call is dialled, not when it ends. Billed like any API call
   * (route rate plus platform fee). A test key simulates it: nothing is dialled.
   * For a full send-and-check flow prefer `verify.start({ channel: 'voice' })`, which
   * also stores the code (hashed) and checks it for you.
   */
  voiceOtp(params: VoiceOtpParams, opts?: { idempotencyKey?: string } & RequestOptions): Promise<VoiceOtpResult> {
    return this.http.request<VoiceOtpResult>('POST', '/comms/voice-otp', {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey,
    });
  }

  /** GET /comms/voice-otp/:id - outcome and cost of a voice passcode call (scope: voice:send). */
  getVoiceOtp(voiceOtpId: string, opts?: RequestOptions): Promise<VoiceOtpStatus> {
    return this.http.request<VoiceOtpStatus>('GET', `/comms/voice-otp/${encodeURIComponent(voiceOtpId)}`, opts);
  }

  /**
   * GET /comms/sms/:messageId - delivery status and timeline for one message.
   *
   * `timeline` runs queued, sent, then delivered or failed, with a timestamp per step,
   * and `errorCode` is set on failure. `delivered` only ever comes from a carrier
   * delivery receipt: on a route that returns none the message stays `sent` with
   * `awaitingReceipt: true` (see `routeReturnsReceipts`). An unknown id resolves with
   * `status: 'not_found'` rather than throwing. The `sms.delivered` and `sms.failed`
   * webhooks report the same changes without polling.
   */
  getSms(messageId: string, opts?: RequestOptions): Promise<CommsSmsStatus> {
    return this.http.request<CommsSmsStatus>('GET', `/comms/sms/${encodeURIComponent(messageId)}`, opts);
  }
}
