import type { HttpClient, Page, RequestOptions } from '../http.js';
import type { RoutingStrategy } from './routes.js';

/** Params for placing a single outbound call (`comms.call`). */
export interface CallParams {
  to: string;
  from: string;
  /** Pin a purchased route; omit for Smart Routing by `strategy`. */
  routeId?: string;
  strategy?: RoutingStrategy;
  /** Max call duration in seconds (10-3600, default 300). */
  maxDuration?: number;
}

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

export interface SmsResult {
  messageId?: string;
  status: string;
  cost: string;
  segments?: number;
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

  /** POST /comms/calls - place a single outbound call (scope: voice:send). */
  call(params: CallParams, opts?: { idempotencyKey?: string } & RequestOptions): Promise<CallResult> {
    return this.http.request<CallResult>('POST', '/comms/calls', {
      ...opts,
      body: params,
      idempotencyKey: opts?.idempotencyKey,
    });
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

  /** GET /comms/sms/:messageId - delivery-status lookup for one message. */
  getSms(messageId: string, opts?: RequestOptions) {
    return this.http.request<{
      messageId: string;
      status: string;
      dlrSupported: boolean;
      cost?: string;
      reference?: string;
      sentAt?: string;
    }>('GET', `/comms/sms/${encodeURIComponent(messageId)}`, opts);
  }
}
