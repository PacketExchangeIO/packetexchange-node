import type { ApiKey as GeneratedApiKey, CreatedApiKey } from './generated/schemas.js';

// Hand-written domain types used by the resource methods. They are declared here
// rather than derived at build time so the package has no runtime dependencies and
// dist/index.d.ts is self-contained.
//
// The `*Input` types describe request bodies: optional fields may be omitted and
// nullable fields accept `null` to clear a value. Keep them in step with openapi.json
// when the API changes.

// ── Enum unions ──
export type RouteType = 'voice' | 'sms';
export type CliType = 'full_cli' | 'local_cli' | 'mixed_cli' | 'ncli' | 'partial_cli';
export type RouteQualityType = 'direct' | 'premium' | 'standard' | 'ncli';
export type RouteVisibility = 'public' | 'private';
export type SmsType = 'a2p' | 'p2p' | 'both';
export type SmsSenderIdType = 'alphanumeric' | 'numeric' | 'preregistered';
export type ApiKeyScope =
  | 'voice:send'
  | 'sms:send'
  | 'dialer:write'
  | 'routes:read'
  | 'account:read'
  // Verify API (send + check one-time codes by SMS or voice).
  | 'verify:write';
export type ApiKeyEnvironment = 'live' | 'test';
export type DialerCampaignStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed';
export type DialerNumberStatus =
  | 'pending'
  | 'dialing'
  | 'answered'
  | 'no_answer'
  | 'busy'
  | 'failed'
  | 'skipped';
export type CliTestStatus =
  | 'scheduled'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';
export type CliTestRecurrence = 'none' | 'daily' | 'weekly';

// ── User ──
export interface User {
  id: string;
  email: string;
  companyName: string | null;
  contactName: string;
  phone: string | null;
  country: string | null;
  timezone: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  balance: string;
  testCredit: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── API Keys ──
/** An API key as the list and update endpoints return it (generated from the spec). */
export type ApiKey = GeneratedApiKey;

/**
 * The create response. The full secret in `key` is returned once. `keyPrefix` matches
 * the list and update responses; `prefix` is an older alias kept for compatibility.
 */
export type ApiKeyCreateResult = CreatedApiKey;

export interface ApiKeyCreateInput {
  label: string;
  scopes?: ApiKeyScope[];
  environment?: ApiKeyEnvironment;
  expiresAt?: string | null;
}

export interface ApiKeyUpdateInput {
  label?: string;
  scopes?: ApiKeyScope[];
}

// ── Routes ──
export interface Route {
  id: string;
  sellerId: string;
  type: RouteType;
  country: string;
  countryCode: string;
  prefix: string[];
  destinationName: string;
  pricePerUnit: string;
  cliType: CliType;
  capacity: number;
  expectedAsr: string | null;
  expectedAcd: string | null;
  expectedPdd: string | null;
  minAcd: number | null;
  billingIncrement: string | null;
  routeType: RouteQualityType;
  wholesaleCompatible: boolean;
  callcenterCompatible: boolean;
  dialerCompatible: boolean;
  visibility: RouteVisibility;
  jingleEnabled: boolean;
  jingleApiUrl: string | null;
  jingleSipIp: string | null;
  t38Support: boolean;
  supportedCodecs: string[] | null;
  maxCallDuration: number | null;
  smsType: SmsType | null;
  smsDlrSupport: boolean | null;
  smsConcatSupport: boolean | null;
  smsSenderIdType: SmsSenderIdType | null;
  smsContentRestrictions: string | null;
  timeOfDayPricing: Record<string, string> | null;
  notes: string | null;
  status: 'active' | 'paused' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteCreateInput {
  type: RouteType;
  country: string;
  countryCode: string;
  prefix: string[];
  destinationName: string;
  pricePerUnit: string;
  cliType: CliType;
  capacity: number;
  expectedAsr?: string;
  expectedAcd?: string;
  expectedPdd?: string;
  minAcd?: number;
  billingIncrement?: string;
  routeType: RouteQualityType;
  wholesaleCompatible?: boolean;
  callcenterCompatible?: boolean;
  dialerCompatible?: boolean;
  visibility?: RouteVisibility;
  jingleEnabled?: boolean;
  jingleApiUrl?: string;
  jingleSipIp?: string;
  t38Support?: boolean;
  supportedCodecs?: string[];
  maxCallDuration?: number;
  smsType?: SmsType;
  smsDlrSupport?: boolean;
  smsConcatSupport?: boolean;
  smsSenderIdType?: SmsSenderIdType;
  smsContentRestrictions?: string;
  timeOfDayPricing?: Record<string, string>;
  notes?: string;
}

// Route update: every create field is optional.
export type RouteUpdateInput = Partial<RouteCreateInput>;

export interface RouteFilterInput {
  type?: RouteType;
  country?: string;
  countryCode?: string;
  cliType?: CliType;
  routeType?: RouteQualityType;
  minPrice?: string;
  maxPrice?: string;
  minAsr?: string;
  minAcd?: string;
  maxPdd?: string;
  minScore?: number;
  minCapacity?: number;
  billing?: 'per_second' | 'per_minute';
  wholesale?: 'true' | 'false';
  callcenter?: 'true' | 'false';
  search?: string;
  sort?:
    | 'price_asc'
    | 'price_desc'
    | 'asr_desc'
    | 'asr_asc'
    | 'acd_desc'
    | 'acd_asc'
    | 'pdd_asc'
    | 'pdd_desc'
    | 'capacity_desc'
    | 'created_desc'
    | 'country_asc'
    | 'score_desc'
    | 'score_asc';
  cursor?: string;
  limit?: number;
}

// ── Offers ──
export interface OfferCreateInput {
  routeId: string;
  proposedPrice: string;
  message?: string;
}

export interface OfferActionInput {
  action: 'counter' | 'accept' | 'reject' | 'withdraw';
  price?: string;
  message?: string;
}

export interface OfferBulkInput {
  items: Array<{ routeId: string; proposedPrice: string }>;
  message?: string;
}

export interface OfferGroupActionInput {
  action: 'accept' | 'reject';
  message?: string;
}

// ── Dialer ──
export interface DialerCampaign {
  id: string;
  userId: string;
  routeId: string;
  name: string;
  status: DialerCampaignStatus;
  targetAcd: string | null;
  targetAsr: string | null;
  concurrency: number;
  maxCallDuration: number;
  callInterval: number;
  platformFeePerCall: string;
  totalNumbers: number;
  totalClis: number;
  numbersDialed: number;
  numbersAnswered: number;
  numbersFailed: number;
  totalDurationSeconds: number;
  notes: string | null;
  maxAttempts: number;
  retryDelayMinutes: number;
  maxSpend: string | null;
  scheduleAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DialerNumber {
  id: string;
  campaignId: string;
  number: string;
  status: DialerNumberStatus;
  sipResponseCode: number | null;
  durationSeconds: number | null;
  attempt: number;
  nextAttemptAt: Date | null;
  dialedAt: Date | null;
  answeredAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface DialerCli {
  id: string;
  campaignId: string;
  cli: string;
  status: 'pending' | 'verified' | 'failed';
  verified: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
}

export interface DialerCampaignStats {
  totalNumbers: number;
  numbersDialed: number;
  numbersAnswered: number;
  numbersFailed: number;
  numbersPending: number;
  totalDurationSeconds: number;
  asr: number;
  acd: number;
  progress: number;
}

export interface DialerCampaignCreateInput {
  name: string;
  routeId: string;
  kind?: 'voice' | 'sms';
  messageBody?: string;
  senderId?: string;
  targetAcd?: string;
  targetAsr?: string;
  concurrency?: number;
  maxCallDuration?: number;
  callInterval?: number;
  notes?: string;
  windowStartHour?: number;
  windowEndHour?: number;
  windowTz?: string;
  maxAttempts?: number;
  retryDelayMinutes?: number;
  maxSpend?: string;
  scheduleAt?: string;
}

export interface DialerCampaignUpdateInput {
  name?: string;
  messageBody?: string | null;
  senderId?: string | null;
  targetAcd?: string | null;
  targetAsr?: string | null;
  concurrency?: number;
  maxCallDuration?: number;
  callInterval?: number;
  notes?: string | null;
  windowStartHour?: number | null;
  windowEndHour?: number | null;
  windowTz?: string | null;
  maxAttempts?: number;
  retryDelayMinutes?: number;
  maxSpend?: string | null;
  scheduleAt?: string | null;
}

export interface DialerCampaignFilterInput {
  status?: DialerCampaignStatus;
  search?: string;
  cursor?: string;
  limit?: number;
}

export interface DialerNumbersFilterInput {
  status?: DialerNumberStatus;
  cursor?: string;
  limit?: number;
}

// ── Purchases ──
export interface Purchase {
  id: string;
  buyerId: string;
  routeId: string;
  status: 'active' | 'paused' | 'cancelled';
  sipUsername: string | null;
  sipPassword: string | null;
  smppSystemId: string | null;
  smppPassword: string | null;
  createdAt: Date;
  cancelledAt: Date | null;
}

export interface PurchaseWithRoute extends Purchase {
  route: {
    type: 'voice' | 'sms';
    country: string;
    destinationName: string;
    pricePerUnit: string;
    billingIncrement: string | null;
    jingleSipIp: string | null;
    capacity: number;
    expectedAsr: string | null;
    expectedAcd: string | null;
  };
}

// ── CLI Tests ──
export interface CliTestCreateInput {
  routeId: string;
  displayCli: string;
  testCountry: string;
  testNumber?: string;
  scheduledAt?: string;
  recurrence?: CliTestRecurrence;
}

export interface CliTestFilterInput {
  routeId?: string;
  status?: CliTestStatus;
  cursor?: string;
  limit?: number;
}
