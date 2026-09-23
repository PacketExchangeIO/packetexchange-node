/* eslint-disable */
// Do not edit by hand: produced by scripts/generate-types.mjs.
// Source: openapi.json (PacketExchange API 1.2.0).
// Regenerate with: npm run generate
//
// Every type below mirrors a schema in the public OpenAPI document. Money fields are
// USD decimal strings with 6 places ("0.012500"): do arithmetic with a decimal
// library, not floating point.

/** US dollars as a decimal string with exactly 6 decimal places, e.g. "0.012500". Do money arithmetic with a decimal type, not floating point. */
export type Money = string;

export interface Message {
  message: string;
}

export interface Deleted {
  id: string;
  deleted: true;
}

export interface ValidationIssue {
  /** Dot-joined path of the offending field ("" for the whole body) */
  path: string;
  message: string;
}

export interface Error {
  /** Stable machine-readable code; see the error-code reference */
  code: string;
  /** Human-readable explanation, safe to show to an operator */
  message: string;
  /** VALIDATION_ERROR: an array of { path, message }. Some codes attach a code-specific object. Usually absent otherwise. */
  details?: Array<ValidationIssue> | {
    [key: string]: unknown;
  };
}

export interface ErrorEnvelope {
  success: false;
  error: Error;
}

export interface AccountProfile {
  id: string;
  email: string;
  contactName: string;
  companyName: string | null;
  jobTitle: string | null;
  phone: string | null;
  /** ISO-3166-1 alpha-2 */
  country: string | null;
  timezone: string;
  companyLogoUrl: string | null;
  avatarUrl: string | null;
  role: "user" | "admin";
  status: "active" | "suspended";
  accountKind: string;
  balance: Money;
  /** Sandbox credit, spendable only by test API keys */
  testCredit: Money;
  /** ISO-8601 timestamp (UTC) */
  emailVerifiedAt: string | null;
  /** An address change waiting for confirmation */
  pendingEmail: string | null;
  verificationStatus: "unverified" | "verified";
  kycStatus: "not_started" | "pending" | "verified" | "rejected";
  /** Two-factor authentication is on */
  totpEnabled: boolean;
  taxId: string | null;
  taxCountry: string | null;
  payoutMethod: string | null;
  onboardingGoal: string | null;
  onboardingDismissed: boolean;
  onboardingSeen: boolean;
  emailNotificationsOptOut: boolean;
  switchStatus: "none" | "active" | "past_due" | "canceled" | "comp";
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface AccountBalance {
  balance: Money;
  testCredit: Money;
  /** balance + testCredit */
  total: Money;
}

export interface AccountActivityEvent {
  id: string;
  /** e.g. login, password_change, api_key_created, session_revoked */
  type: string;
  ip: string | null;
  userAgent: string | null;
  meta: {
    [key: string]: unknown;
  } | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface AccountClosurePreview {
  /** USD, 2-decimal string */
  balanceUsd: string;
  /** Held back because it came from a recent card top-up */
  heldUsd: string;
  withdrawableUsd: string;
  minWithdrawalUsd: number;
  pendingPayouts: number;
  revshareEarningsUsd: string;
  pendingRevsharePayouts: number;
  canCloseNow: boolean;
  canWithdraw: boolean;
  revshareCanWithdraw: boolean;
  /** The only way out is to give up an amount stuck under the payout minimum */
  forfeitRequired: boolean;
  forfeitBalanceUsd: string | null;
  forfeitRevshareUsd: string | null;
  /** Echo this exact figure as confirmForfeitAmountUsd to close with a forfeit */
  forfeitAmountUsd: string | null;
  message: string;
}

export interface AccountSwitchEntitlement {
  /** May this account use the Switch right now */
  active: boolean;
  status: "none" | "active" | "past_due" | "canceled" | "comp";
  /** ISO-8601 timestamp (UTC) */
  accessUntil: string | null;
  comp: boolean;
  /** Access comes from a held Switch Node NFT */
  nodeNft: boolean;
  /** Monthly plan price in USD (a number, not a ledger amount) */
  priceUsd: number;
  plan: string;
  purchasablePlans: Array<"starter" | "essentials" | "standard" | "growth" | "carrier">;
  onTrial: boolean;
  /** ISO-8601 timestamp (UTC) */
  trialEndsAt: string | null;
  trialEligible: boolean;
  trialDays: number;
  trialApplication: {
    id: string;
    status: "pending" | "approved" | "declined";
    desiredPlan: string;
    /** ISO-8601 timestamp (UTC) */
    submittedAt: string;
    /** ISO-8601 timestamp (UTC) */
    reviewedAt: string | null;
  } | null;
  /** ISO-8601 timestamp (UTC) */
  firstChargeDeferredTo: string | null;
  /** ISO-8601 timestamp (UTC) */
  cancelAt: string | null;
  /** Has a card subscription that the billing portal can manage */
  manageable: boolean;
}

export interface AccountSpendAlerts {
  /** USD, 2-decimal string; null = no low-balance alert */
  lowBalanceThreshold: string | null;
  /** USD, 2-decimal string; null = no daily cap alert */
  dailySpendCap: string | null;
  notifyEmail: boolean;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string | null;
}

export interface AccountSavedSearch {
  id: string;
  userId: string;
  name: string;
  /** Marketplace filter values, as the marketplace query parameters */
  filters: {
    [key: string]: unknown;
  };
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface AccountFavoriteRoute {
  favoriteId: string;
  /** ISO-8601 timestamp (UTC) */
  favoritedAt: string;
  /** The route id */
  id: string;
  type: "voice" | "sms";
  country: string;
  destinationName: string;
  /** USD per minute (voice) or per message segment (SMS) */
  pricePerUnit: Money;
  billingIncrement: string | null;
  status: string;
  /** Seller-stated ASR %, 2-decimal string */
  expectedAsr: string | null;
  /** Seller-stated ACD in minutes, 2-decimal string */
  expectedAcd: string | null;
  dialerCompatible: boolean;
}

export interface AccountDedicatedIp {
  assignmentId: string;
  ipId: string;
  address: string;
  /** ingress = where you send traffic; egress = where your calls leave from */
  role: "ingress" | "egress";
  boundBox: string | null;
  /** ISO-8601 timestamp (UTC) */
  assignedAt: string;
  /** Plain-English instruction for this address */
  hint: string;
}

export interface AccountActivatedIp {
  assignmentId: string;
  ipId: string;
  address: string;
  /** ingress = where you send traffic; egress = where your calls leave from */
  role: "ingress" | "egress";
  boundBox: string | null;
  /** ISO-8601 timestamp (UTC) */
  assignedAt: string;
  /** Plain-English instruction for this address */
  hint: string;
  /** False when you already held one (idempotent replay) */
  created: boolean;
  /** Monthly premium in USD (a number) */
  monthlyPriceUsd: number;
  /** USD booked by THIS call; 0 on a replay */
  charged: number;
}

export interface AccountInterconnect {
  enabled?: boolean;
  myIngressIp: string | null;
  myEgressIp: string | null;
  egressPendingNetwork?: boolean;
  /** The shared address to send SIP to when you hold no dedicated one */
  edgeIp: string;
  /** Addresses our calls leave from; whitelist these with your carriers */
  egressIps: Array<string>;
  rtpPortRange: string;
  sipPort: number;
  onPlatform: boolean;
  onPlatformSignals: {
    switchOperator: boolean;
    marketplaceBuyer: boolean;
    dialerUser: boolean;
  };
  autoAuthorized: boolean;
  manualWhitelistNeeded: boolean;
  authorizedIps: Array<string>;
  poolAvailable: number;
  egressPoolAvailable: number;
  egressAvailable: boolean;
  sipUsername: string | null;
  hasSipPassword: boolean;
  [key: string]: unknown;
}

export interface AccountConnectivityBrief {
  dedicatedIpsEnabled: boolean;
  myAddress: string | null;
  myAddressSummary: string;
  /** Where to send your SIP traffic */
  sendTo: string;
  sendToPort: number;
  sendToSummary: string;
  egressMode: "dedicated" | "shared";
  egressAddresses: Array<string>;
  egressSummary: string;
  authMethods: Array<"ip" | "digest">;
  authSummary: string;
  authorizedSourceIps: Array<string>;
  purchasedRoutes: Array<{
    purchaseId: string;
    routeId: string;
    routeName: string | null;
    destination: string | null;
    type: string;
    status: string;
    sendTo: string;
    sendToPort: number;
    sipUsername: string | null;
    [key: string]: unknown;
  }>;
  rtpPortRange: string;
  codecs: Array<string>;
  autoAuthorized: boolean;
  manualWhitelistNeeded: boolean;
}

export interface AuthTokens {
  /** JWT access token. Send as `Authorization: Bearer <token>`. */
  accessToken: string;
  /** Refresh token (7 days). Also set as an httpOnly cookie scoped to /api/v1/auth. */
  refreshToken: string;
  /** Access-token lifetime in seconds (900) */
  expiresIn: number;
}

export interface AuthSession {
  /** JWT access token. Send as `Authorization: Bearer <token>`. */
  accessToken: string;
  /** Refresh token (7 days). Also set as an httpOnly cookie scoped to /api/v1/auth. */
  refreshToken: string;
  /** Access-token lifetime in seconds (900) */
  expiresIn: number;
  user: AccountProfile;
}

export interface AuthMfaChallenge {
  mfaRequired: true;
  /** Short-lived (5 minutes) token to send with a TOTP code to POST /auth/2fa/verify */
  mfaToken: string;
}

export interface AuthDeviceSession {
  id: string;
  ip: string | null;
  userAgent: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  lastSeenAt: string | null;
  /** True for the session making this request (matched via the refresh token) */
  current: boolean;
}

export interface ApiKey {
  id: string;
  /** The first characters of the key, for recognising it. The full key is never shown again. */
  keyPrefix: string;
  label: string;
  /** null = full access; otherwise the only scopes this key may use */
  scopes: (Array<"voice:send" | "sms:send" | "dialer:write" | "routes:read" | "account:read" | "purchases:write" | "offers:write" | "billing:write" | "numbers:read" | "numbers:write" | "account:write" | "routes:write" | "cdr:numbers" | "application:write" | "switch:manage" | "verify:write" | "webhooks:write">) | null;
  environment: "live" | "test";
  /** ISO-8601 timestamp (UTC) */
  lastUsedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string | null;
}

export interface CreatedApiKey {
  id: string;
  /** The full secret key. Returned ONCE, here; store it now. */
  key: string;
  /** Same value as `prefix`; the name the list and update responses use. */
  keyPrefix: string;
  /** Deprecated alias of `keyPrefix`, kept for existing clients. */
  prefix: string;
  label: string;
  scopes: (Array<"voice:send" | "sms:send" | "dialer:write" | "routes:read" | "account:read" | "purchases:write" | "offers:write" | "billing:write" | "numbers:read" | "numbers:write" | "account:write" | "routes:write" | "cdr:numbers" | "application:write" | "switch:manage" | "verify:write" | "webhooks:write">) | null;
  environment: "live" | "test";
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string | null;
}

export interface Webhook {
  id: string;
  url: string;
  /** Last 4 characters of the signing secret, to tell secrets apart */
  secretLast4: string;
  events: Array<"call.completed" | "call.ringing" | "call.answered" | "call.gathered" | "sms.sent" | "sms.dlr" | "sms.delivered" | "sms.failed" | "campaign.started" | "campaign.completed" | "topup.confirmed" | "balance.low" | "offer.received" | "route.purchased" | "sub_account.balance_low" | "sub_account.suspended" | "sub_account.resumed" | "sub_account.topup_requested" | "number.call.received" | "number.sms.received" | "number.voicemail.received" | "invoice.created" | "invoice.issued" | "invoice.sent" | "invoice.voided" | "invoice.reissued" | "invoice.payment" | "credit_note.issued" | "payable.created" | "netting.run" | "sell_rate.changed" | "cost_rate.scheduled" | "cost_rate.activated" | "cost_rate.rolled_back" | "sub_account.margin_below_floor" | "ping">;
  /** False when you disabled it, or after sustained delivery failures */
  isActive: boolean;
  /** Consecutive failed deliveries; resets on success */
  failureCount: number;
  /** ISO-8601 timestamp (UTC) */
  lastDeliveryAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface WebhookWithSecret {
  id: string;
  url: string;
  /** Last 4 characters of the signing secret, to tell secrets apart */
  secretLast4: string;
  events: Array<"call.completed" | "call.ringing" | "call.answered" | "call.gathered" | "sms.sent" | "sms.dlr" | "sms.delivered" | "sms.failed" | "campaign.started" | "campaign.completed" | "topup.confirmed" | "balance.low" | "offer.received" | "route.purchased" | "sub_account.balance_low" | "sub_account.suspended" | "sub_account.resumed" | "sub_account.topup_requested" | "number.call.received" | "number.sms.received" | "number.voicemail.received" | "invoice.created" | "invoice.issued" | "invoice.sent" | "invoice.voided" | "invoice.reissued" | "invoice.payment" | "credit_note.issued" | "payable.created" | "netting.run" | "sell_rate.changed" | "cost_rate.scheduled" | "cost_rate.activated" | "cost_rate.rolled_back" | "sub_account.margin_below_floor" | "ping">;
  /** False when you disabled it, or after sustained delivery failures */
  isActive: boolean;
  /** Consecutive failed deliveries; resets on success */
  failureCount: number;
  /** ISO-8601 timestamp (UTC) */
  lastDeliveryAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  /** The signing secret. Returned ONCE; store it now. */
  secret: string;
}

export interface WebhookDelivery {
  /** Also sent as the X-Webhook-Id header. Automatic retries reuse it (de-duplicate on it); a manual resend is a new delivery with a new id. */
  id: string;
  /** Present on the account-wide list */
  webhookId?: string;
  /** The endpoint URL, on the account-wide list */
  url?: string;
  event: string;
  status: "pending" | "sending" | "delivered" | "failed";
  /** Response code your server returned on the last attempt */
  httpStatus: number | null;
  /** Attempts so far (max 5, with attempts^2-minute backoff) */
  attempts: number;
  lastError: string | null;
  /** ISO-8601 timestamp (UTC) */
  nextRetryAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  deliveredAt: string | null;
}

export interface ApiUsage {
  totalRequests: number;
  /** Fraction of requests answered 4xx/5xx, 0 to 1 */
  errorRate: number;
  p95LatencyMs: number;
  byDay: Array<{
    /** YYYY-MM-DD (UTC) */
    date: string;
    count: number;
    errors: number;
  }>;
  topEndpoints: Array<{
    /** Route pattern, e.g. /api/v1/routes/:id */
    path: string;
    count: number;
  }>;
  /** The key the figures are filtered to, or null for all traffic */
  keyId: string | null;
}

/** Trust signals only. The marketplace never names the seller behind a listing. */
export interface MarketplaceSellerProfile {
  /** Seller identity verified */
  verified: boolean;
  /** Average Exchange Score across the seller's trafficked routes */
  sellerScore: number | null;
}

/** A route as a buyer sees it: no seller identity, endpoints or credentials. */
export interface MarketplaceRoute {
  id: string;
  kind: "single" | "blend";
  type: "voice" | "sms";
  country: string;
  /** E.164 country calling code, digits only */
  countryCode: string;
  /** Dial prefixes the route covers */
  prefix: Array<string>;
  /** The route name. For buyers it is cleaned of seller names and contact details. */
  destinationName: string;
  cliType: "full_cli" | "ncli" | "partial_cli" | "local_cli" | "mixed_cli";
  /** Quality tier */
  routeType: "direct" | "premium" | "standard" | "ncli";
  /** USD per minute (voice) or per message segment (SMS). On an A-Z deck (rateCount > 0) the per-destination rates apply instead. */
  pricePerUnit: Money;
  /** First/subsequent increment in seconds, e.g. "60/60" */
  billingIncrement: string | null;
  /** Channels (voice) or messages per second (SMS) */
  capacity: number;
  /** Seller-stated ASR %, not measured */
  expectedAsr: string | null;
  /** Seller-stated ACD in seconds */
  expectedAcd: string | null;
  /** Seller-stated PDD in seconds */
  expectedPdd: string | null;
  minAcd: number | null;
  /** Decimal as a string, e.g. "92.50" */
  minAsr: string | null;
  visibility: "public" | "private";
  status: "active" | "paused" | "suspended" | "pending_review";
  wholesaleCompatible: boolean;
  callcenterCompatible: boolean;
  dialerCompatible: boolean;
  retailCompatible: boolean;
  otpCompatible: boolean;
  notes: string | null;
  smsType?: ("a2p" | "p2p" | "both") | null;
  /** Exchange Score 1-100, null until the route has carried real traffic */
  exchangeScore: number | null;
  /** ISO-8601 timestamp (UTC) */
  lastQcAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  /** True only on your own listings */
  isOwn: boolean;
  /** Trust signals only. The marketplace never names the seller behind a listing. */
  sellerProfile: MarketplaceSellerProfile | null;
  /** Active per-destination deck rows; > 0 means an A-Z deck */
  rateCount: number;
  /** Real 24h price movement from the price history; null when the route has not repriced */
  priceTrend?: {
    changePct: number;
    points: Array<number>;
  } | null;
}

/** A route you listed, as only you (the seller) see it. Passwords are never returned. */
export interface OwnRoute {
  id: string;
  kind: "single" | "blend";
  type: "voice" | "sms";
  country: string;
  /** E.164 country calling code, digits only */
  countryCode: string;
  /** Dial prefixes the route covers */
  prefix: Array<string>;
  /** The route name. For buyers it is cleaned of seller names and contact details. */
  destinationName: string;
  cliType: "full_cli" | "ncli" | "partial_cli" | "local_cli" | "mixed_cli";
  /** Quality tier */
  routeType: "direct" | "premium" | "standard" | "ncli";
  /** USD per minute (voice) or per message segment (SMS). On an A-Z deck (rateCount > 0) the per-destination rates apply instead. */
  pricePerUnit: Money;
  /** First/subsequent increment in seconds, e.g. "60/60" */
  billingIncrement: string | null;
  /** Channels (voice) or messages per second (SMS) */
  capacity: number;
  /** Seller-stated ASR %, not measured */
  expectedAsr: string | null;
  /** Seller-stated ACD in seconds */
  expectedAcd: string | null;
  /** Seller-stated PDD in seconds */
  expectedPdd: string | null;
  minAcd: number | null;
  /** Decimal as a string, e.g. "92.50" */
  minAsr: string | null;
  visibility: "public" | "private";
  status: "active" | "paused" | "suspended" | "pending_review";
  wholesaleCompatible: boolean;
  callcenterCompatible: boolean;
  dialerCompatible: boolean;
  retailCompatible: boolean;
  otpCompatible: boolean;
  notes: string | null;
  smsType?: ("a2p" | "p2p" | "both") | null;
  /** Exchange Score 1-100, null until the route has carried real traffic */
  exchangeScore: number | null;
  /** ISO-8601 timestamp (UTC) */
  lastQcAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  /** Your own account id */
  sellerId: string;
  isOwner?: true;
  parentRouteId: string | null;
  isBundle: boolean;
  /** Your SIP endpoint */
  jingleSipIp: string | null;
  sipPort: number | null;
  techPrefix: string | null;
  sipAuthUsername: string | null;
  /** A SIP digest password is stored (never returned) */
  sipAuthPasswordSet: boolean;
  smsDeliveryMethod?: ("http" | "smpp") | null;
  smsDeliveryUrl: string | null;
  smppHost: string | null;
  smppPort: number | null;
  smppSystemId: string | null;
  /** An SMPP password is stored (never returned) */
  smppPasswordSet: boolean;
  endpointReachable: boolean | null;
  /** ISO-8601 timestamp (UTC) */
  endpointCheckedAt: string | null;
  /** Trust signals only. The marketplace never names the seller behind a listing. */
  sellerProfile?: MarketplaceSellerProfile | null;
  rateCount?: number;
}

export interface MarketplaceStats {
  total: number;
  voiceCount: number;
  smsCount: number;
  destinations: number;
  /** Signed-in callers only. Average list price (display figure) */
  avgPrice?: number | null;
  /** Signed-in only. Average seller-stated ASR % */
  avgAsr?: number | null;
  /** Signed-in only. Measured ASR % over 30 days of real calls */
  measuredAsr?: number | null;
  /** Signed-in only */
  avgScore?: number | null;
  /** Signed-in only */
  totalCapacity?: number;
}

export interface ConnectivityTestResult {
  /** True when the endpoint answered from every one of our media addresses */
  pass: boolean;
  /** Reachable but refusing our calls */
  barred?: boolean;
  /** Refusing some of our source addresses */
  degraded?: boolean;
  checks: Array<{
    label: string;
    value: string;
    ok: boolean;
  }>;
  /** The addresses our traffic comes from; whitelist these */
  egressAddresses: string;
  /** Deprecated alias of egressAddresses */
  gatewayIp: string;
  diagnostics?: {
    [key: string]: unknown;
  };
  message: string;
}

export interface ResolvedRoute {
  id: string;
  destinationName: string;
  country: string;
  countryCode: string;
  type: "voice" | "sms";
  cliType: string | null;
  /** Rate for this destination: USD per minute or message, 6-decimal string */
  price: Money;
  asr: number | null;
  acd: number | null;
  matchedPrefix: string | null;
}

/** One route that serves the number, at the rate it would charge for it. Never names the seller. */
export interface PricedRoute {
  id: string;
  type: "voice" | "sms";
  /** The route name as a buyer may read it (seller names and contact details removed) */
  name: string;
  country: string;
  /** E.164 country calling code, digits only */
  countryCode: string;
  /** The dial prefix the number matched on this route (the longest one, on a deck) */
  matchedPrefix: string;
  /** The destination that prefix belongs to, e.g. "United Kingdom-Mobile"; the country for a flat-priced listing */
  destination: string;
  /** What this route charges for THIS number: USD per minute (voice) or per message (SMS) */
  rate: Money;
  /** e.g. "60/60" or "1/1"; null when the listing does not state one */
  billingIncrement: string | null;
  /** deck = priced by the matching rate-sheet row; flat = the listing's single price */
  pricedBy: "deck" | "flat";
  /** Seller-stated ASR %, not measured */
  expectedAsr: string | null;
  /** Seller-stated ACD in seconds */
  expectedAcd: string | null;
  cliType: string;
  /** Quality tier */
  routeType: string;
  /** Channels (voice) or messages per second (SMS) */
  capacity: number;
  /** Exchange Score 1-100; null ("New") until the route has carried traffic */
  exchangeScore: number | null;
  /** True only on your own listing (signed-in callers), so you are not offered your own route */
  isOwn: boolean;
  /** SMS routes that price the country per mobile network: which network `rate` is for. Absent otherwise */
  network?: {
    /** Mobile network code (MCC-MNC) `rate` is for, e.g. "234-10"; null when unknown */
    mccMnc: string | null;
    /** Network name from public number-range data, e.g. "O2" */
    operator: string | null;
    /** range = number-range data; none = not determined */
    source: "range" | "hlr" | "none";
    /** network = that network's own rate; all_operators = the route's rate for networks it does not list separately; country = the price for other or unknown networks */
    rateBasis: "network" | "all_operators" | "country";
  } | null;
  /** SMS routes that price per network: the price for other or unknown networks */
  countryRate?: Money | null;
}

export interface RouteRate {
  id: string;
  routeId: string;
  destinationName: string;
  operator: string | null;
  prefix: string;
  ratePerUnit: Money;
  billingIncrement: string | null;
  minDuration: number | null;
  /** ISO-8601 timestamp (UTC) */
  effectiveDate: string | null;
  status: string;
  /** SMS sheets priced by network code: the network the row price came from ("214" = whole country) */
  mccMnc?: string | null;
  /** SMS sheets priced by network: the price per destination network (charged per network when `networkPriced` is true). A message is charged its network's rate (networks not listed pay the All Operators rate when there is one); `ratePerUnit` is the price for other or unknown networks. The network is determined from the number's range (ported numbers may be priced at the network the range belongs to) */
  operatorRates?: (Array<{
    /** "214-07" for one network; "214" for All Operators */
    mccMnc: string;
    operator: string | null;
    rate: Money;
  }>) | null;
  /** True when each SMS on this row is charged its destination network's rate from `operatorRates`; `ratePerUnit` then applies to other or unknown networks */
  networkPriced?: boolean;
  [key: string]: unknown;
}

export interface RateSheetImport {
  id: string;
  routeId: string;
  filename: string;
  fileType: string;
  status: string;
  rowCount: number | null;
  columnMapping?: unknown;
  previewRows?: unknown;
  warnings?: unknown;
  currency: string | null;
  fxRate: string | null;
  errorMessage: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  appliedAt: string | null;
  [key: string]: unknown;
}

export interface ListingHealth {
  /** Your routes that are active, public and not an A-Z deck parent: what you have put on sale */
  listed: number;
  /** How many of those buyers can actually see on the marketplace (counted with the marketplace's own filters) */
  live: number;
  /** listed - live */
  hidden: number;
  /** Why the hidden routes are hidden, in the order to fix them. Only reasons with a non-zero count are present. */
  reasons: Array<{
    /** sms_no_delivery and voice_no_endpoint can be listed with GET /routes/my/list?hiddenReason=<key> and fixed in bulk; restricted = a destination the exchange does not carry */
    key: "sms_no_delivery" | "voice_no_endpoint" | "restricted";
    count: number;
    /** The reason in plain words */
    label: string;
    /** What to do about it */
    fix: string;
  }>;
}

export interface BulkEndpointResult {
  /** Routes changed. Always 0 on a dry run. */
  updated: number;
  /** Dry run (or nothing eligible): how many routes the call would change */
  wouldUpdate?: number;
  /** Routes left untouched, each with the reason */
  skipped: Array<{
    id: string;
    /** not_found: not one of your live routes. not_sms / not_voice: wrong route type for this action. deck_parent: set it on the deck's own Edit page. blend: a blend has no endpoint of its own. duplicate_listing (SIP only): another of your routes already lists this country and prefixes on that IP and tech prefix. */
    reason: "not_found" | "not_sms" | "not_voice" | "deck_parent" | "blend" | "duplicate_listing";
  }>;
  /** The one endpoint check run for the whole batch (an SMPP bind, a URL check or a SIP probe). pass is false only when confirmUnreachable applied a SIP endpoint anyway. */
  check?: {
    pass: boolean;
    message: string;
  };
  dryRun?: boolean;
}

export interface PriceNumberResult {
  /** The number as priced: digits only */
  number: string;
  type: "voice" | "sms";
  /** What `rate` is per: a minute (voice) or a message (SMS) */
  unit: "min" | "msg";
  /** Routes that serve the number, before the 100-row cap */
  total: number;
  /** Cheapest first */
  routes: Array<PricedRoute>;
  /** Why the list is empty when it is empty for a reason other than "no route covers it" */
  notice: "sanctioned" | null;
}

export interface RouteAccessGrant {
  id: string;
  routeId: string;
  userId: string | null;
  /** Price this buyer pays instead of the list price */
  customPrice: Money | null;
  inviteCode: string | null;
  status: ("pending" | "active" | "revoked") | string;
  message: string | null;
  /** ISO-8601 timestamp (UTC) */
  requestedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  [key: string]: unknown;
}

export interface RouteReport {
  id: string;
  routeId: string;
  routeName: string | null;
  role: "buyer" | "seller";
  /** Null for the seller, who sees only the pseudonym */
  buyerId: string | null;
  buyerLabel: string;
  category: "call_failure" | "connectivity" | "quality" | "other";
  subject: string | null;
  status: "open" | "acknowledged" | "resolved" | "confirmed" | "reopened" | "escalated" | "closed";
  /** Call evidence; seller addresses are masked for the buyer */
  evidence?: unknown;
  verifyResult?: unknown;
  escalated: boolean;
  unread: boolean;
  /** ISO-8601 timestamp (UTC) */
  lastActivityAt: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  resolvedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  closedAt: string | null;
}

export interface RouteReportThread {
  id: string;
  routeId: string;
  routeName: string | null;
  role: "buyer" | "seller";
  /** Null for the seller, who sees only the pseudonym */
  buyerId: string | null;
  buyerLabel: string;
  category: "call_failure" | "connectivity" | "quality" | "other";
  subject: string | null;
  status: "open" | "acknowledged" | "resolved" | "confirmed" | "reopened" | "escalated" | "closed";
  /** Call evidence; seller addresses are masked for the buyer */
  evidence?: unknown;
  verifyResult?: unknown;
  escalated: boolean;
  unread: boolean;
  /** ISO-8601 timestamp (UTC) */
  lastActivityAt: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  resolvedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  closedAt: string | null;
  messages: Array<{
    id: string;
    role: "buyer" | "seller" | "system" | "staff";
    kind: "message" | "status_change" | "verification";
    authorLabel: string;
    mine: boolean;
    body: string;
    meta?: unknown;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
  }>;
}

export interface Purchase {
  id: string;
  /** Your account id */
  buyerId: string;
  routeId: string;
  status: "active" | "paused" | "cancelled" | "pending_review";
  sipUsername: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  cancelledAt: string | null;
  /** Negotiated price (from an accepted offer) that overrides the list price */
  agreedPrice: Money | null;
  /** Set while the purchase is paused by a seller rate increase: the rate you were paying */
  heldOldRate: Money | null;
  /** The increased rate waiting for your acceptance */
  heldNewRate: Money | null;
  /** Your routing position (1 = first); null = unranked */
  routingPriority: number | null;
  /** Your own SIP password, for your connection card */
  sipPassword: string | null;
  /** Deck fingerprint to pass as deckVersion when accepting a deck increase */
  heldDeckVersion: string | null;
  route: {
    type: "voice" | "sms";
    country: string;
    prefix: Array<string>;
    countryCode: string;
    /** Cleaned of seller names and contact details */
    destinationName: string;
    pricePerUnit: Money;
    billingIncrement: string | null;
    /** Always null: the seller endpoint is never disclosed */
    jingleSipIp: "null" | null;
    capacity: number;
    expectedAsr: string | null;
    expectedAcd: string | null;
    dialerCompatible: boolean;
    rateCount: number;
  };
}

export interface PurchaseDetail {
  id: string;
  /** Your account id */
  buyerId: string;
  routeId: string;
  status: "active" | "paused" | "cancelled" | "pending_review";
  sipUsername: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  cancelledAt: string | null;
  /** Negotiated price (from an accepted offer) that overrides the list price */
  agreedPrice: Money | null;
  /** Set while the purchase is paused by a seller rate increase: the rate you were paying */
  heldOldRate: Money | null;
  /** The increased rate waiting for your acceptance */
  heldNewRate: Money | null;
  /** Your routing position (1 = first); null = unranked */
  routingPriority: number | null;
  /** A US voice route that needs STIR/SHAKEN review before traffic flows */
  requiresUsCompliance: boolean;
  /** ISO-8601 timestamp (UTC) */
  reviewedAt: string | null;
  /** The compliance reviewer's note to you, if any */
  reviewNote: string | null;
  /** Whether a SIP password exists. The value is not returned here: it is shown once at purchase, on your purchased-routes list and on Interconnections. */
  sipPasswordSet: boolean;
  smppSystemId: string | null;
  /** The accepted offer that set agreedPrice */
  offerId: string | null;
  route: {
    id: string;
    type: "voice" | "sms";
    country: string;
    destinationName: string;
    pricePerUnit: Money;
    billingIncrement: string | null;
    jingleSipIp: "null" | null;
  } | null;
  /** Where to send your SIP traffic */
  sipPublicIp: string;
}

export interface PurchaseRow {
  id: string;
  /** Your account id */
  buyerId: string;
  routeId: string;
  status: "active" | "paused" | "cancelled" | "pending_review";
  sipUsername: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  cancelledAt: string | null;
  /** Negotiated price (from an accepted offer) that overrides the list price */
  agreedPrice: Money | null;
  /** Set while the purchase is paused by a seller rate increase: the rate you were paying */
  heldOldRate: Money | null;
  /** The increased rate waiting for your acceptance */
  heldNewRate: Money | null;
  /** Your routing position (1 = first); null = unranked */
  routingPriority: number | null;
  /** A US voice route that needs STIR/SHAKEN review before traffic flows */
  requiresUsCompliance: boolean;
  /** ISO-8601 timestamp (UTC) */
  reviewedAt: string | null;
  /** The compliance reviewer's note to you, if any */
  reviewNote: string | null;
  /** Whether a SIP password exists. The value is not returned here: it is shown once at purchase, on your purchased-routes list and on Interconnections. */
  sipPasswordSet: boolean;
  smppSystemId: string | null;
  /** The accepted offer that set agreedPrice */
  offerId: string | null;
}

export interface RoutingOrderEntry {
  purchaseId: string;
  routeId: string;
  status: "active" | "paused" | "cancelled" | "pending_review";
  /** Your position (1 = first); null = unranked */
  routingPriority: number | null;
  /** When you bought it (the tie-break among unranked routes) */
  createdAt: string;
  /** Cleaned of seller names and contact details */
  destinationName: string;
  country: string;
  countryCode: string;
  prefix: Array<string>;
  /** Priced by an A-Z rate sheet, so it can overlap any destination */
  rateSheet: boolean;
}

export interface RouteForCandidate {
  /** 1 = the route that would carry the call */
  position: number;
  carries: boolean;
  /** null for one of your own listings */
  purchaseId: string | null;
  routeId: string;
  /** True when this is a route you sell yourself */
  ownRoute: boolean;
  /** Cleaned of seller names and contact details (your own routes keep their name) */
  destinationName: string;
  country: string;
  matchedPrefix: string | null;
  /** Length of the matching prefix */
  matchedDigits: number;
  routingPriority: number | null;
  /** What you are billed per minute for this number on this route */
  rate: Money | null;
  /** The route is priced by an A-Z rate sheet */
  rateSheet: boolean;
  /** ISO-8601 timestamp (UTC) */
  purchasedAt: string | null;
  /** For every route after the first: why the route above it wins */
  behindBecause: ("prefix" | "routing_order" | "rate" | "age" | "route_id") | null;
}

export interface RoutingOrderResult {
  order: Array<{
    purchaseId: string;
    routingPriority: number;
  }>;
}

export interface RouteForResult {
  /** The number as checked, "+" and digits */
  number: string;
  /** The route that would carry it (candidates[0]); null when none covers it */
  carriedBy: RouteForCandidate | null;
  /** Why that route wins, in words */
  reason: string;
  /** The step that decided between the first two routes; null with fewer than two */
  decidedBy: ("prefix" | "routing_order" | "rate" | "age" | "route_id") | null;
  candidates: Array<RouteForCandidate>;
  refused: {
    reason: "embargoed" | "no_balance";
    message: string;
  } | null;
}

export interface PurchaseUpcomingRateChanges {
  purchaseId: string;
  /** True when you pay the list rate, so this change would pause you until accepted */
  affectsYou: boolean;
  changes: Array<{
    /** Pass as changeId to POST /purchases/{id}/accept-rate */
    changeId: string;
    /** flat = the route's single price changes; deck = rate-sheet rows change */
    kind: "flat" | "deck";
    /** ISO-8601 timestamp (UTC) */
    effectiveDate: string;
    increases: number;
    decreases: number;
    added: number;
    removed: number;
    largestIncreasePct: number | null;
    accepted: boolean;
    /** ISO-8601 timestamp (UTC) */
    acceptedAt: string | null;
    rows: Array<{
      destination: string | null;
      prefix: string | null;
      /** US dollars as a decimal string with exactly 6 decimal places, e.g. "0.012500". Do money arithmetic with a decimal type, not floating point. */
      oldRate: Money | null;
      /** US dollars as a decimal string with exactly 6 decimal places, e.g. "0.012500". Do money arithmetic with a decimal type, not floating point. */
      newRate: Money | null;
      oldIncrement: string | null;
      newIncrement: string | null;
      deltaPct: number | null;
      removed: boolean;
    }>;
    /** Rows in the change for this listing (rows is capped at 200) */
    totalRows: number;
  }>;
}

export interface Offer {
  id: string;
  routeId: string;
  /** Set when the offer is part of a bulk (multi-route) offer */
  groupId: string | null;
  /** The route list price when the offer was made */
  listPrice: Money | null;
  /** The latest price on the table */
  proposedPrice: Money;
  /** Set once accepted */
  agreedPrice: Money | null;
  status: "pending" | "countered" | "accepted" | "rejected" | "withdrawn" | "expired";
  lastActor: "buyer" | "seller";
  /** Cleaned of contact details */
  message: string | null;
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  /** Your side of this offer */
  role: "buyer" | "seller";
  yourTurn: boolean;
  /** Pseudonym for the other side, stable per route */
  counterparty: string;
  route: {
    id: string;
    destinationName: string;
    country: string;
    countryCode: string;
    type: "voice" | "sms";
    routeType: string;
    pricePerUnit: Money;
  } | null;
}

export type CallAction = {
  /** Text spoken by our text-to-speech voice */
  say: string;
  /** Overrides the call default for this action */
  language?: "en" | "es" | "fr" | "de" | "pt" | "hi";
} | {
  /** HTTPS URL of an MP3 file, at most 2 MB. We download it once before dialling (public addresses only, no redirects) and play our copy */
  play: string;
} | {
  gather: {
    /** Most keys to collect */
    digits?: number;
    /** Seconds to wait for the first key */
    timeout?: number;
    /** Key that ends input early; empty for none */
    finishOnKey?: "#" | "*" | "";
    /** Prompt and wait again this many times in total when nothing is pressed */
    tries?: number;
    /** Prompt spoken while listening; a key press interrupts it */
    say?: string;
    /** Prompt played while listening (instead of say) */
    play?: string;
    language?: "en" | "es" | "fr" | "de" | "pt" | "hi";
  };
} | {
  /** Seconds of silence */
  pause: number;
} | {
  hangup: true;
};

export interface CommsCallAccepted {
  /** Use with GET /comms/calls/{id}; the same id appears on the call.* webhooks */
  callId: string;
  /** The call has been handed to the network and is being dialled */
  status: "ringing";
  mode: "async";
  to: string;
  from: string;
  /** How many call actions will run on answer */
  actions: number;
  /** Path of GET /comms/calls/{id} for this call */
  statusUrl: string;
}

export interface CommsCallStatus {
  callId: string;
  /** queued, ringing and answered are live states; completed (answered, then ended), no_answer, busy and failed are final */
  status: "queued" | "ringing" | "answered" | "completed" | "no_answer" | "busy" | "failed";
  mode: "sync" | "async";
  to: string;
  from: string;
  /** True for test-key calls: nothing was dialled */
  simulated: boolean;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  ringingAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  answeredAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  endedAt: string | null;
  durationSeconds: number | null;
  /** Duration rounded up to the route billing increment */
  billableSeconds: number | null;
  /** What the call cost you, platform fee included. Null until it ends */
  cost: Money | null;
  billingIncrement: string | null;
  sipResponseCode: number | null;
  /** The switch cause code, e.g. NORMAL_CLEARING or USER_BUSY */
  hangupCause: string | null;
  /** Why the call ended, in plain words. Null while it is live */
  hangupReason: string | null;
  /** Why the call could not be placed, when it failed before reaching the network */
  error: string | null;
  /** The call actions as you sent them */
  actions: Array<unknown> | null;
  /** Keypad input from gather actions, filled in when the call ends */
  gathered: (Array<{
    /** Which gather action (0 for the first) */
    index: number;
    /** The keys pressed, without the finish key */
    digits: string | null;
    /** no_input: nothing was pressed, or the call ended before this step */
    status: "received" | "no_input";
  }>) | null;
}

export interface CommsCall {
  callId: string;
  to: string;
  from: string;
  /** Final outcome. `accepted` is returned only for simulated calls on a test key */
  status: "answered" | "no_answer" | "busy" | "failed" | "accepted";
  sipResponseCode: number | null;
  hangupCause: string | null;
  durationSeconds: number;
  /** Duration rounded up to the route billing increment */
  billableSeconds: number;
  /** What this call cost you, platform fee included */
  cost: Money;
  /** The route billing increment, e.g. "6/6" or "60/60" */
  billingIncrement: string;
  /** ISO-8601 timestamp (UTC) */
  startedAt: string;
  /** ISO-8601 timestamp (UTC) */
  completedAt: string;
  /** Present and true for test-key calls: nothing was dialled */
  simulated?: boolean;
  /** Failover path only: the route that carried (or last attempted) the call */
  routeId?: string | null;
  /** Failover path only: each route tried, in order */
  attempts?: Array<{
    routeId: string;
    sipResponseCode: number | null;
    status: string;
    hangupCause: string | null;
  }>;
}

export interface CommsSms {
  /** Use with GET /comms/sms/{messageId} */
  messageId: string;
  to: string;
  from: string;
  /** Send-time outcome when we forwarded the message, not a handset delivery receipt */
  status: "sent" | "delivered" | "failed" | "pending" | "accepted";
  /** Billed segments (160 GSM-7 / 70 UCS-2 characters each, fewer when concatenated) */
  segments: number;
  cost: Money;
  /** ISO-8601 timestamp (UTC) */
  submittedAt: string;
  /** Present and true for test-key messages: nothing was sent */
  simulated?: boolean;
  /** Present when the route prices SMS to this country per destination network. The network is determined from the number's range (ported numbers may be priced at the network the range belongs to) */
  network?: {
    /** Mobile network code (MCC-MNC) the message was priced as, e.g. "234-10" */
    mccMnc: string | null;
    /** Network name from public number-range data */
    operator: string | null;
    /** range = number-range data; hlr = a live network lookup; none = not determined */
    source: "range" | "hlr" | "none";
    /** network = that network's own rate; all_operators = the route's rate for networks it does not list separately; country = the route's price for other or unknown networks */
    rateBasis: "network" | "all_operators" | "country";
  } | null;
}

export interface CommsHistoryEntry {
  id: string;
  userId: string;
  /** Ledger entry type, e.g. charge */
  type: string;
  /** Signed: a charge is negative */
  amount: Money;
  balanceAfter: Money;
  /** Human-readable description of the call or message */
  reference: string | null;
  /** api_call for calls; api_sms or smpp_sms for messages */
  relatedEntityType: string | null;
  /** The callId or messageId */
  relatedEntityId: string | null;
  callId: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface SmsTimelineStep {
  /** queued = charged and waiting to be handed off; sent = the route accepted it; accepted = simulated on a test key; delivered / failed = final */
  status: "queued" | "sent" | "accepted" | "delivered" | "failed";
  /** ISO-8601 timestamp (UTC) */
  at: string;
  /** Where we learned it: our ledger, the hand-off to the route, the carrier's delivery receipt, or a test-key simulation */
  source: "platform" | "submit" | "carrier_receipt" | "simulated";
  /** On failed: SELLER_REJECTED, NO_ENDPOINT, UNDELIVERABLE, EXPIRED or REJECTED */
  errorCode?: string | null;
  /** The carrier receipt's own status value, e.g. DELIVRD or UNDELIV */
  carrierStatus?: string | null;
  /** The carrier receipt's own error value, when it sent one */
  carrierError?: string | null;
}

export interface CommsSmsStatus {
  messageId: string;
  /** Current state: sent, accepted (test key), delivered or failed; not_found when the id is not on your account. delivered only ever comes from a carrier receipt */
  status: string;
  to?: string | null;
  from?: string | null;
  segments?: number | null;
  /** Set when status is failed: SELLER_REJECTED (the route refused the hand-off), NO_ENDPOINT, UNDELIVERABLE, EXPIRED or REJECTED (from the carrier receipt) */
  errorCode?: string | null;
  /** Every state the message has been in, oldest first */
  timeline?: Array<SmsTimelineStep>;
  /** True while the message is sent and no carrier receipt has arrived. It stays true for good on a route that returns no receipts */
  awaitingReceipt?: boolean;
  /** Whether the route that carried this message has returned at least one carrier receipt in the last 30 days. null for test-key messages */
  routeReturnsReceipts?: boolean | null;
  /** True: the platform collects carrier delivery receipts. Whether one arrives for this message depends on the route (routeReturnsReceipts) */
  dlrSupported?: boolean;
  /** Present and true for test-key messages: nothing was sent */
  simulated?: boolean;
  /** The ledger amount of the charge (negative) */
  cost?: Money;
  reference?: string | null;
  /** When the message was charged */
  sentAt?: string;
  /** Explanation, present when status is not_found */
  message?: string;
}

export interface CommsBulkSmsResult {
  total: number;
  sent: number;
  /** Failed plus skipped */
  failed: number;
  totalCost: Money;
  results: Array<{
    to: string;
    /** The send status, or failed / skipped */
    status: string;
    messageId?: string;
    from?: string;
    segments?: number;
    /** US dollars as a decimal string with exactly 6 decimal places, e.g. "0.012500". Do money arithmetic with a decimal type, not floating point. */
    cost?: Money;
    /** ISO-8601 timestamp (UTC) */
    submittedAt?: string;
    error?: string;
  }>;
}

export interface VoiceOtpResult {
  /** Use with GET /comms/voice-otp/{id} */
  voiceOtpId: string;
  /** The call carrying the code; it also appears in GET /comms/calls and the call.completed webhook */
  callId: string;
  /** `initiated`: the call is ringing. `accepted`: simulated on a test key */
  status: "initiated" | "accepted";
  to: string;
  /** The caller ID presented */
  from: string;
  language: string;
  codeLength: number;
  /** How many times the code is read */
  repeat: number;
  /** Present only when we generated the code AND you sent `returnCode: true` */
  code?: string;
  /** Test keys: the simulated charge. Live: null here; the final cost arrives with call.completed and on GET */
  cost: Money | null;
  /** Present and true for test keys: nothing was dialled */
  simulated?: boolean;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface VoiceOtpStatus {
  voiceOtpId: string;
  callId: string | null;
  status: "initiated" | "answered" | "no_answer" | "busy" | "failed" | "accepted";
  to: string;
  language: string;
  codeLength: number;
  /** What the call cost you, platform fee included. Null until it ends */
  cost: Money | null;
  durationSeconds: number | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  completedAt: string | null;
  simulated?: boolean;
}

export interface VerifyStartResult {
  /** Pass to POST /verify/check */
  verificationId: string;
  to: string;
  channel: "sms" | "voice";
  status: "pending";
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string;
  /** Wrong guesses allowed before the verification is dead (5) */
  maxAttempts: number;
  /** The messageId (SMS) or callId (voice) that carried the code */
  sendRef: string;
  /** SMS send-time status, or `initiated` for a voice call */
  sendStatus: string;
  /** Present and true for test keys: nothing was sent */
  simulated?: boolean;
  /** Test keys ONLY: the code, so a sandbox can complete the check. Never present on a live key */
  testCode?: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface VerifyCheckResult {
  verificationId: string;
  status: "approved" | "denied" | "expired" | "max_attempts";
  attemptsRemaining: number;
  /** Why a check was not approved, when it is not obvious from `status` */
  reason?: "wrong_code" | "already_used" | "not_pending";
}

export interface Verification {
  verificationId: string;
  to: string;
  channel: "sms" | "voice";
  status: "pending" | "approved" | "expired" | "max_attempts" | "failed";
  attempts: number;
  maxAttempts: number;
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  approvedAt: string | null;
  sendRef: string | null;
  sendStatus: string | null;
  simulated?: boolean;
}

export interface DidCatalogSku {
  /** Pass to POST /dids/buy */
  skuId: string;
  /** Concurrent call channels included */
  channels: number;
  /** One-off price in USD (display number, not a money string) */
  setupPrice: number;
  /** Monthly price in USD (display number, not a money string) */
  monthlyPrice: number;
}

export interface DidCatalogGroup {
  /** Pass to POST /dids/buy with a skuId */
  groupId: string;
  country: string;
  /** Catalogue country id (filter value), not an ISO code */
  countryId: string;
  countryPrefix: string;
  city: string | null;
  areaPrefix: string | null;
  typeId: string | null;
  /** Local, National, Mobile, Toll-free... */
  typeName: string | null;
  skus: Array<DidCatalogSku>;
}

export interface DidCatalogCountry {
  countryId: string;
  country: string;
  countryPrefix: string;
}

export interface DidCatalogType {
  id: string;
  name: string;
}

export interface Did {
  id: string;
  /** null while the number is still being provisioned */
  number: string | null;
  country: string | null;
  /** ISO-3166-1 alpha-2 country code */
  countryCode: string | null;
  city: string | null;
  areaPrefix: string | null;
  didType: string | null;
  channelsIncluded: number;
  /** suspended = a monthly renewal failed; the number is held for `graceDays` before release */
  status: "pending" | "active" | "suspended" | "released" | "failed";
  pointMode: "unrouted" | "sip" | "forward";
  /** Primary destination: host[:port] for sip, E.164 for forward */
  pointsTo: string | null;
  pointsToBackup: string | null;
  autoRenew: boolean;
  setupPrice: Money;
  monthlyPrice: Money;
  /** ISO-8601 timestamp (UTC) */
  orderedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  activatedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  nextRenewalAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  suspendedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  releasedAt: string | null;
  /** null = not checked yet */
  endpointReachable: boolean | null;
  endpointCause: string | null;
  /** ISO-8601 timestamp (UTC) */
  endpointCheckedAt: string | null;
  /** The AI voice agent answering inbound calls to this number, or null (PUT /dids/{id}/ai-agent) */
  aiAgentId: string | null;
  /** Days an unpaid (suspended) number is held before release */
  graceDays: number;
}

export interface DidBulkBuyResult {
  requested: number;
  succeeded: number;
  failed: number;
  skipped: number;
  items: Array<{
    /** Position in the submitted array */
    index: number;
    skuId: string;
    groupId: string;
    status: "ok" | "failed" | "skipped";
    /** Present when status is ok */
    did?: Did;
    error?: string;
  }>;
}

export interface DidCallFlow {
  strategy: "failover" | "simultaneous";
  timeoutSec: number;
  endpoints: Array<{
    id: string;
    kind: "sip" | "forward" | "hosted";
    target: string | null;
    /** Hosted lines only; the password is never listed */
    sipUsername: string | null;
    label: string | null;
    priority: number;
    enabled: boolean;
  }>;
}

export interface DidSipLineLogin {
  id: string;
  sipUsername: string;
  /** Shown only here and on an explicit reveal */
  sipPassword: string;
  server: string;
  port: string;
}

export interface DidSipLine {
  id: string;
  sipUsername: string;
  label: string | null;
  priority: number;
  enabled: boolean;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DidCalls {
  calls: Array<{
    id: string;
    fromNumber: string | null;
    toNumber: string | null;
    durationSec: number;
    status: string | null;
    /** ISO-8601 timestamp (UTC) */
    startedAt: string;
  }>;
  summary: {
    calls: number;
    minutes: number;
  };
}

export interface DidFeatures {
  voicemail: {
    enabled: boolean;
    mode: "on_no_answer" | "always";
    greetingAssetId: string | null;
    hasGreeting: boolean;
    transcribe: boolean;
  };
  recording: {
    enabled: boolean;
    announce: boolean;
    retentionDays: number;
  };
  ivr: {
    enabled: boolean;
    greetingAssetId: string | null;
    hasGreeting: boolean;
    timeoutSec: number;
    maxRetries: number;
    options: Array<{
      id: string;
      digit: string;
      action: "endpoint" | "voicemail" | "hangup";
      endpointId: string | null;
      label: string | null;
    }>;
  };
  schedule: {
    enabled: boolean;
    timezone: string;
    schedule: {
      sun: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
      mon: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
      tue: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
      wed: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
      thu: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
      fri: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
      sat: Array<{
        /** HH:MM */
        open: string;
        /** HH:MM */
        close: string;
      }>;
    } | null;
    holidays: Array<{
      /** YYYY-MM-DD */
      date: string;
      name?: string;
    }> | null;
    outsideHoursAction: "voicemail" | "endpoints" | "hangup";
    closedEndpoints: Array<{
      id: string;
      kind: "sip" | "forward";
      target: string;
      label: string | null;
      priority: number;
      enabled: boolean;
    }>;
    openNow: boolean | null;
  };
  assets: Array<{
    id: string;
    kind: "voicemail_greeting" | "ivr_greeting";
    name: string | null;
    mime: string;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
  }>;
  /** Whether voicemail and recording capture is live on the platform */
  mediaLive: boolean;
}

export interface DidGreeting {
  id: string;
  kind: "voicemail_greeting" | "ivr_greeting";
  name: string | null;
  mime: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DidRecording {
  id: string;
  kind: "call" | "voicemail";
  fromNumber: string | null;
  toNumber: string | null;
  durationSec: number;
  mime: string | null;
  byteSize: number;
  heard: boolean;
  transcript: string | null;
  hasAudio: boolean;
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DidMessage {
  id: string;
  direction: "in" | "out";
  from: string;
  to: string;
  /** The other party, digits only; the conversation key */
  peer: string;
  body: string;
  segments: number;
  status: "received" | "queued" | "sent" | "delivered" | "failed";
  error: string | null;
  /** Upstream carrier message id */
  providerMessageId: string | null;
  /** ISO-8601 timestamp (UTC) */
  readAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DidSmsSettings {
  smsEnabled: boolean;
  /** https URL each inbound SMS is forwarded to */
  forwardWebhookUrl: string | null;
  notifyEmail: string | null;
}

export interface DidConversation {
  peer: string;
  lastBody: string;
  lastDirection: "in" | "out";
  lastStatus: "received" | "queued" | "sent" | "delivered" | "failed";
  /** ISO-8601 timestamp (UTC) */
  lastAt: string;
  unread: number;
  total: number;
}

export interface DidAnalytics {
  number: string | null;
  status: string;
  price: {
    setup: Money;
    monthly: Money;
  };
  /** USD as display numbers */
  spend: {
    gross: number;
    refunded: number;
    net: number;
    setup: number;
    recurring: number;
  };
  usage: {
    calls: number;
    callMinutes: number;
    sms: number;
    voicemails: number;
    voicemailMinutes: number;
  };
  window: {
    months: number;
    from: string;
  };
  series: Array<{
    calls: number;
    callMinutes: number;
    sms: number;
    voicemails: number;
    voicemailMinutes: number;
    /** YYYY-MM */
    period: string;
    /** USD, display number */
    spend: number;
  }>;
}

export interface DidNumbersOverview {
  counts: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    released: number;
    failed: number;
  };
  /** Sum of monthly prices on active numbers, USD display number */
  monthlyRecurring: number;
  /** Net charged across all your numbers, USD display number */
  lifetimeSpend: number;
  usage: {
    calls: number;
    callMinutes: number;
    sms: number;
    voicemails: number;
    voicemailMinutes: number;
  };
}

export interface DidListingRequestView {
  ownedActiveDids: number;
  /** Your latest request, or null */
  request: {
    id: string;
    status: string;
    selectedDids: (Array<{
      id: string;
      number: string | null;
      country: string | null;
      didType: string | null;
    }>) | null;
    didCount: number | null;
    /** ISO-8601 timestamp (UTC) */
    submittedAt: string;
    /** ISO-8601 timestamp (UTC) */
    reviewedAt: string | null;
  } | null;
  prefill: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
}

export interface DidCliEligible {
  id: string;
  /** Digits only */
  cli: string;
  number: string;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  didType: string | null;
  channels: number;
  label: string | null;
}

export interface DidAiAgent {
  didId: string;
  agentId: string | null;
  agentName: string | null;
  /** A disabled agent does not answer; the number rings its call flow */
  agentEnabled: boolean | null;
  /** Whether inbound AI answering is switched on for the platform right now */
  live: boolean;
  /** AI voice rate in USD per minute, billed per second */
  ratePerMin: string;
}

export interface NumberLookup {
  /** What you sent */
  input: string;
  /** Whether the input is a well-formed E.164 number */
  valid: boolean;
  /** Why it is not valid, when it is not */
  reason: string | null;
  /** + followed by digits, e.g. +447700900123 */
  e164: string | null;
  /** +<country code> <rest>, e.g. +44 7700900123 */
  internationalFormat: string | null;
  country: {
    /** ISO 3166 alpha-2. null for a shared dial code the decks do not resolve (+1, +7) */
    iso: string | null;
    name: string;
    dialCode: string;
    /** rate_decks when the matching destinations name the country; dial_code otherwise */
    basis: "rate_decks" | "dial_code";
  } | null;
  /** Inferred from the destination names on the rate decks that match the number (prefix-based, not an HLR query) */
  numberType: "mobile" | "fixed" | "toll_free" | "premium" | "unknown";
  /** 0 to 1: the share of matching decks that agree on numberType */
  numberTypeConfidence: number;
  /** The network, only when at least three different sellers' decks name the same one for this prefix. Prefix-based: a ported number keeps its original network here */
  operator: string | null;
  /** The mobile network the number's RANGE belongs to, from public number-range data. A ported number keeps its range's network here. null when the range is not known */
  network: {
    /** Mobile network code (MCC-MNC), when known, e.g. "234-58" */
    mccMnc: string | null;
    /** The network the number range was allocated to, e.g. "Manx Telecom" */
    operator: string | null;
    /** range = public number-range data */
    source: "range" | "hlr";
  } | null;
  /** The longest dial prefix any live deck matched */
  matchedPrefix: string | null;
  risk: {
    /** A destination we do not carry (embargoed or platform-blocked) */
    blocked: boolean;
    sanctioned: boolean;
    /** Premium-rate, or a prefix on our high-risk list (satellite, remote and high-cost destinations often abused for revenue-share fraud) */
    highRisk: boolean;
    reasons: Array<string>;
  };
  pricing: {
    /** The cheapest live public route for the number, or null when none serves it */
    voice: {
      /** USD, 6 decimals: per minute for voice, per message for SMS */
      rate: string;
      currency: "USD";
      unit: "min" | "msg";
      /** e.g. "60/60"; null when the listing does not state one */
      billingIncrement: string | null;
      /** The destination the number matched on that route, e.g. "United Kingdom-Mobile" */
      destination: string;
      /** The cheapest public route that serves the number (see GET /routes/{id}) */
      routeId: string;
      /** How many public routes serve the number */
      routesServing: number;
      /** SMS only: the network `rate` is for, when the route prices per network; null otherwise */
      network?: {
        /** Mobile network code (MCC-MNC) the price is for, e.g. "234-10"; null when unknown */
        mccMnc: string | null;
        /** Network name from public number-range data, e.g. "O2" */
        operator: string | null;
        /** range = number-range data; none = not determined */
        source: "range" | "hlr" | "none";
        /** network = that network's own rate; all_operators = the route's rate for networks it does not list separately; country = the route's price for other or unknown networks */
        rateBasis: "network" | "all_operators" | "country";
      } | null;
      /** SMS only: the route's price for other or unknown networks (USD, 6 decimals), when it prices per network */
      countryRate?: string | null;
    } | null;
    /** The cheapest live public route for the number, or null when none serves it */
    sms: {
      /** USD, 6 decimals: per minute for voice, per message for SMS */
      rate: string;
      currency: "USD";
      unit: "min" | "msg";
      /** e.g. "60/60"; null when the listing does not state one */
      billingIncrement: string | null;
      /** The destination the number matched on that route, e.g. "United Kingdom-Mobile" */
      destination: string;
      /** The cheapest public route that serves the number (see GET /routes/{id}) */
      routeId: string;
      /** How many public routes serve the number */
      routesServing: number;
      /** SMS only: the network `rate` is for, when the route prices per network; null otherwise */
      network?: {
        /** Mobile network code (MCC-MNC) the price is for, e.g. "234-10"; null when unknown */
        mccMnc: string | null;
        /** Network name from public number-range data, e.g. "O2" */
        operator: string | null;
        /** range = number-range data; none = not determined */
        source: "range" | "hlr" | "none";
        /** network = that network's own rate; all_operators = the route's rate for networks it does not list separately; country = the route's price for other or unknown networks */
        rateBasis: "network" | "all_operators" | "country";
      } | null;
      /** SMS only: the route's price for other or unknown networks (USD, 6 decimals), when it prices per network */
      countryRate?: string | null;
    } | null;
  };
  /** Always prefix: no carrier network query is made */
  method: "prefix";
  /** When this answer was computed. Answers are cached for up to 10 minutes */
  cachedAt: string;
}

export interface LedgerTransaction {
  id: string;
  userId: string;
  /** charge = usage you paid for; credit = seller earnings or a grant; platform_fee = the exchange fee */
  type: "topup" | "charge" | "credit" | "payout" | "platform_fee" | "test_credit" | "chargeback" | "refund_reversal" | "refund" | "transfer";
  /** Signed: negative for money out (charges, fees, payouts), positive for money in */
  amount: Money;
  balanceAfter: Money;
  reference: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  /** The call or message this line bills; equals the CDR callUuid */
  callId?: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  [key: string]: unknown;
}

/** Supplier-side identity and network fields are nulled unless you are the seller on the record. */
export interface BillingCdr {
  id: string;
  callUuid: string | null;
  /** Groups the legs of one customer call when it failed over */
  callGroupId: string | null;
  direction: "outbound" | "inbound";
  kind: "voice" | "sms";
  routeId: string | null;
  fromNumber: string | null;
  toNumber: string | null;
  cli: string | null;
  status: string | null;
  sipCode: number | null;
  hangupCause: string | null;
  durationSeconds: number | null;
  billedSeconds: number | null;
  /** SMS segments */
  segments: number | null;
  pddMs: number | null;
  /** What you were charged for this record */
  buyerCost: Money | null;
  /** Seller earnings. Null unless you are the seller on this record */
  sellerCredit: Money | null;
  /** US dollars as a decimal string with exactly 6 decimal places, e.g. "0.012500". Do money arithmetic with a decimal type, not floating point. */
  ratePerUnit: Money | null;
  /** ISO-8601 timestamp (UTC) */
  answeredAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  endedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  [key: string]: unknown;
}

export interface BillingExportJob {
  id: string;
  type: "cdr";
  params: {
    /** ISO-8601 timestamp (UTC) */
    from?: string;
    /** ISO-8601 timestamp (UTC) */
    to?: string;
    kind?: "voice" | "sms";
    direction?: "outbound" | "inbound";
  };
  status: "pending" | "running" | "done" | "failed";
  rowCount: number | null;
  error: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  completedAt: string | null;
  /** True once the job is done and its file is on record */
  downloadable: boolean;
  /** The download endpoint for this job once it is done (GET /billing/exports/{id}/download). The only way to the file: no server path is ever returned. */
  downloadUrl: string | null;
  [key: string]: unknown;
}

export interface BillingDocument {
  id: string;
  /** Sequential document number; printed as INV-000123 */
  number: number;
  type: "topup_receipt" | "statement";
  amount: Money;
  currency: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string | null;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  [key: string]: unknown;
}

export interface TaxInvoiceSummary {
  id: string;
  /** Gap-free per-account sequence */
  seq: number;
  number: string;
  /** YYYY-MM */
  period: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string;
  currency: string;
  /** Decimal string */
  subtotal: string;
  /** Decimal string */
  taxAmount: string;
  /** Decimal string */
  total: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface TaxInvoice {
  id: string;
  /** Gap-free per-account sequence */
  seq: number;
  number: string;
  /** YYYY-MM */
  period: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string;
  currency: string;
  /** Decimal string */
  subtotal: string;
  /** Decimal string */
  taxAmount: string;
  /** Decimal string */
  total: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** Frozen line items and the tax section as issued */
  dataJson: {
    [key: string]: unknown;
  } | null;
}

export interface Topup {
  id: string;
  /** stripe = card */
  method: "crypto" | "wire" | "stripe" | "x402";
  amountUsd: Money;
  status: "pending" | "confirmed" | "rejected";
  cryptoToken: string | null;
  cryptoNetwork: string | null;
  cryptoTxHash: string | null;
  wireReference: string | null;
  depositAddress: string | null;
  depositMemo: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  confirmedAt: string | null;
  [key: string]: unknown;
}

export interface Payout {
  id: string;
  method: "crypto" | "wire";
  amountUsd: Money;
  status: "pending" | "processing" | "completed" | "rejected";
  cryptoToken: string | null;
  cryptoNetwork: string | null;
  cryptoAddress: string | null;
  cryptoTxHash: string | null;
  wireBankDetails: {
    [key: string]: string;
  } | null;
  /** Note from the team when processing, e.g. a rejection reason */
  adminNote: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  processedAt: string | null;
  [key: string]: unknown;
}

export interface AutoRecharge {
  enabled: boolean;
  /** USD, 2-decimal string: recharge when the balance falls below this */
  threshold: string | null;
  /** USD, 2-decimal string: how much each recharge adds */
  amount: string | null;
  /** USD, 2-decimal string: most that auto-recharge may charge per UTC day */
  dailyCap: string | null;
  hasDefaultCard: boolean;
}

export interface DialerCampaign {
  id: string;
  userId: string;
  /** The purchased route the campaign sends over */
  routeId: string | null;
  name: string;
  kind: "voice" | "sms";
  /** test = created with a test key; simulated, never really dialled or billed */
  environment: "live" | "test";
  status: "draft" | "ready" | "running" | "paused" | "completed" | "failed";
  /** SMS campaigns: the message text */
  messageBody: string | null;
  /** SMS campaigns: the sender ID */
  senderId: string | null;
  /** Voice campaigns: the AI voice agent that handles answered calls */
  aiAgentId: string | null;
  concurrency: number;
  /** Seconds */
  maxCallDuration: number;
  callInterval: number;
  platformFeePerCall: Money;
  totalNumbers: number;
  totalClis: number;
  cliSetId: string | null;
  /** Caller-ID rotation strategy, when a caller-ID set is assigned */
  cliStrategy: {
    [key: string]: unknown;
  } | null;
  numbersDialed: number;
  numbersAnswered: number;
  numbersFailed: number;
  totalDurationSeconds: number;
  windowStartHour: number | null;
  windowEndHour: number | null;
  windowTz: string | null;
  maxAttempts: number;
  retryDelayMinutes: number;
  /** Budget cap; the campaign pauses when reached */
  maxSpend: Money | null;
  /** ISO-8601 timestamp (UTC) */
  scheduleAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  startedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  completedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface DialerCampaignStats {
  totalNumbers: number;
  numbersDialed: number;
  numbersAnswered: number;
  numbersFailed: number;
  numbersPending: number;
  totalDurationSeconds: number;
  /** Answer-seizure ratio, percent */
  asr: number;
  /** Average call duration, seconds */
  acd: number;
  /** Percent of numbers dialled */
  progress: number;
  activeCalls: number;
  /** USD spent so far (a display number, not a 6-decimal string) */
  totalSpend: number;
  /** Budget cap in USD, as a number */
  maxSpend: number | null;
  /** Percent of the budget used */
  budgetProgress: number | null;
}

export interface DialerNumber {
  id: string;
  campaignId: string;
  number: string;
  status: "pending" | "dialing" | "answered" | "no_answer" | "busy" | "failed" | "skipped";
  sipResponseCode: number | null;
  durationSeconds: number | null;
  attempt: number;
  /** ISO-8601 timestamp (UTC) */
  nextAttemptAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  dialedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  answeredAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  completedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** Cost of the latest call to this number, when there is one */
  cost: Money | null;
  /** Caller ID presented on the latest call */
  cli: string | null;
  sipCause: string | null;
}

export interface DialerNumbersUploadResult {
  /** Same as `inserted` (kept for existing clients) */
  count: number;
  inserted: number;
  skipped: number;
  /** Up to 200 rejected entries with the reason */
  rejects: Array<{
    value: string;
    reason: string;
  }>;
  totalNumbers: number;
  campaign: DialerCampaign;
}

export interface DialerCampaignCli {
  id: string;
  campaignId: string;
  cli: string;
  status: "pending" | "verified" | "failed";
  verified: boolean;
  /** ISO-8601 timestamp (UTC) */
  verifiedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DialerContactMapping {
  /** 0-based header row, or -1 when the file has none */
  headerRowIndex: number;
  columns: {
    phone: number;
    name: number | null;
    firstName: number | null;
    lastName: number | null;
  };
  /** Columns kept as per-contact fields */
  extraColumns: Array<number>;
  notes?: string;
}

export interface DialerCallerIdSet {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface DialerCallerIdNumber {
  id: string;
  setId: string;
  cli: string;
  label: string | null;
  country: string | null;
  countryCode: string | null;
  areaCode: string | null;
  source: "upload" | "paste" | "manual" | "revshare" | "did";
  enabled: boolean;
  weight: number;
  dailyCap: number | null;
  campaignCap: number | null;
  hourlyCap: number | null;
  cooldownSec: number | null;
  status: "active" | "resting" | "retired";
  tags: Array<string>;
  notes: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DialerCallerIdAddResult {
  inserted: number;
  skipped: number;
  rejects: Array<{
    value: string;
    reason: string;
  }>;
}

export interface DialerRevshareCaller {
  /** The MASKED leading digits of the caller; full numbers are never stored */
  prefix: string;
  fromCarrier: string | null;
  originIso: string | null;
  originCountry: string | null;
  originDialCode: string | null;
  callCount: number;
  /** ISO-8601 timestamp (UTC) */
  lastCallAt: string | null;
  /** False for masked prefixes, which is currently always the case */
  dialable: boolean;
}

export interface DialerContactList {
  id: string;
  userId: string;
  name: string;
  count: number;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DialerCompatibleTargets {
  setId: string;
  setName: string;
  groups: Array<{
    cli: string;
    label: string | null;
    country: string | null;
    countryCode: string | null;
    targets: Array<DialerRevshareCaller>;
  }>;
  /** The saved contact list, when saveAsListName was given and there was something dialable to save */
  saved: {
    list: DialerContactList;
    saved: number;
    skipped: number;
  } | null;
  limitation: string | null;
}

export interface DialerSmsTemplate {
  id: string;
  userId: string;
  name: string;
  body: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DialerCliSet {
  id: string;
  userId: string;
  name: string;
  /** The caller IDs, newline-separated */
  clis: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface DialerContactParseResult {
  hasHeader: boolean;
  columns: Array<{
    index: number;
    label: string;
  }>;
  sampleRows: Array<Array<string>>;
  dataRows: Array<Array<string>>;
  suggestedMapping: DialerContactMapping;
  rowCount: number;
  truncated: boolean;
}

export interface CliTest {
  id: string;
  routeId: string | null;
  blendRouteId: string | null;
  /** The caller ID presented on the test call */
  displayCli: string;
  testCountry: string;
  /** The handset that received the call */
  testNumber: string | null;
  status: "scheduled" | "pending" | "dispatching" | "in_progress" | "completed" | "failed" | "not_tested" | "cancelled";
  recurrence: string;
  /** ISO-8601 timestamp (UTC) */
  scheduledAt: string | null;
  /** What the handset actually displayed */
  reportedCli: string | null;
  displayedCorrectly: boolean | null;
  resultNotes: string | null;
  /** ISO-8601 timestamp (UTC) */
  dispatchedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  completedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface RouteTestItem {
  /** The ordinary caller-ID test behind this row (GET /cli-tests/{id}) */
  testId: string;
  routeId: string;
  /** The route name as a buyer may read it */
  routeName: string;
  country: string;
  /** 1-based place in the order you submitted */
  position: number;
  /** Call attempts made so far */
  attempts: number;
  /** USD actually charged for this route, as a JSON number: the test price if it rang, else 0 */
  charged: number;
  /** rang = the route is live (a handset rang). no_ring = the call was placed and did not ring. not_tested = we could not place a test (no handset, provider trouble): NOT a result for the route. queued / waiting_handset / calling / retrying are still in progress. */
  state: "queued" | "waiting_handset" | "calling" | "retrying" | "rang" | "no_ring" | "not_tested" | "cancelled";
  /** The state in words, e.g. "Live, rang" */
  label: string;
  /** One plain sentence under the label */
  detail: string | null;
  /** Why a call did not ring (the SIP-level reason in words) */
  ringReason: string | null;
  /** The caller-ID verdict. It can arrive up to 24 hours after the ring. */
  callerId: {
    state: "pending" | "match" | "partial" | "replaced" | "restricted" | "not_available";
    label: string;
  };
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface RouteTestBatch {
  id: string;
  /** The description you gave the test, e.g. "Search: Pakistan, Voice" */
  searchLabel: string;
  status: "running" | "finished" | "cancelled";
  /** The caller ID presented on every test call */
  displayCli: string;
  routeCount: number;
  /** USD per route that rings (JSON number) */
  costPerTest: number;
  /** USD if every route rings: the most this test can cost (JSON number) */
  costCeiling: number;
  /** USD actually charged so far (JSON number) */
  chargedTotal: number;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  finishedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  cancelledAt: string | null;
  /** True while any route still needs a call. Poll GET /cli-tests/batches/{id} while this is true. */
  active: boolean;
  /** Routes that rang and are still waiting for a caller-ID report */
  callerIdPending: number;
  /** Routes per state */
  summary: {
    queued: number;
    waiting_handset: number;
    calling: number;
    retrying: number;
    rang: number;
    no_ring: number;
    not_tested: number;
    cancelled: number;
  };
  /** One row per route, in the order you submitted */
  items: Array<RouteTestItem>;
}

export interface RouteTestPreview {
  /** False when the test handset network is not connected: a route test cannot start */
  enabled: boolean;
  routes: Array<{
    id: string;
    /** "A route" when the route is not one you may see */
    name: string;
    country: string | null;
    testable: boolean;
    /** Why it cannot be tested */
    reason: string | null;
  }>;
  testableCount: number;
  /** Smallest route test (2). To test one route use POST /cli-tests. */
  minRoutes: number;
  /** Largest route test (20 by default) */
  maxRoutes: number;
  /** USD per route that rings (JSON number) */
  costPerTest: number;
  /** USD if every testable route rings (JSON number) */
  maxCost: number;
  /** Your balance in USD (JSON number) */
  balance: number | null;
  /** Test calls in the last hour against the hourly cap */
  quota: {
    usedThisHour: number;
    capPerHour: number;
    remaining: number;
  };
  countries: Array<{
    country: string;
    routes: number;
    /** Test handsets online now; null when availability could not be read */
    handsets: number | null;
    /** Calls that can run at once in this country (0 = none can start) */
    parallel: number;
    /** Estimated seconds to call every route in this country once */
    seconds: number | null;
  }>;
  /** Estimated time for the whole test */
  estimatedSeconds: number | null;
  /** Countries with no handset online now: their routes wait, then close as not tested */
  noHandsetCountries: Array<string>;
  /** How long a route waits for a handset before it closes as not tested */
  handsetWaitMinutes: number;
  /** Rest between two calls to the same handset */
  gapSeconds: number;
  maxParallel: number;
  /** Your route test already running, if any (only one may run at a time) */
  runningBatchId: string | null;
}

export interface DncEntry {
  id: string;
  /** null = a platform-wide entry (read-only to you) */
  userId: string | null;
  /** Digits only */
  phoneNumber: string;
  reason: string | null;
  /** How it was added */
  source: "manual" | "sms_stop" | "upload" | "callguard_optout";
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface AiAgent {
  id: string;
  userId: string;
  name: string;
  voiceId: string | null;
  voiceProvider: string;
  language: string;
  /** What the agent says when the call is answered */
  firstMessage: string | null;
  /** The script and instructions the agent follows */
  systemPrompt: string;
  model: string;
  guardrails: string | null;
  tools: Array<string>;
  maxCallSeconds: number;
  enabled: boolean;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface AiVoice {
  id: string;
  name: string;
  description: string;
  gender: string;
  language: string;
  is_pro: boolean;
}

export interface AiAgentDraft {
  name: string;
  firstMessage: string;
  systemPrompt: string;
  guardrails: string;
  suggestedTools: Array<string>;
}

export interface AiAgentTurn {
  /** What the agent would say */
  reply: string;
  action: "continue" | "end" | "transfer";
  /** Structured details captured this turn (name, email, intent...) */
  captured?: {
    [key: string]: string;
  };
}

export interface SwitchCustomer {
  id: string;
  label: string;
  source: "marketplace" | "external";
  status: "draft" | "active" | "suspended" | "closed";
  externalRef: string | null;
  /** Prepaid wallet balance (negative = owed), 6-decimal USD string */
  balance: Money;
  /** USD decimal string as stored (2 decimal places), e.g. "5000.00" */
  creditLimit: string;
  currency: string | null;
  /** Default markup over cost, percent as a decimal string */
  markupPct: string | null;
  /** e.g. "60/60" or "6/6" */
  billingIncrement: string | null;
  minMarginPct: string | null;
  marginFloorAction: ("block" | "alert") | null;
  /** USD decimal string as stored (2 decimal places), e.g. "5000.00" */
  dailySpendCap: string | null;
  maxConcurrentCalls: number | null;
  maxCps: number | null;
  blockedPrefixes: Array<string> | null;
  sipUsername: string | null;
  /** Whether an inbound SIP password is set. The value itself is only ever returned by the audited credentials endpoint. */
  sipPasswordSet: boolean;
  portalEmail: string | null;
  taxCountry: string | null;
  taxId: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchCustomerListRow {
  id: string;
  label: string;
  source: "marketplace" | "external";
  status: "draft" | "active" | "suspended" | "closed";
  externalRef: string | null;
  balance: Money;
  /** USD decimal string as stored (2 decimal places), e.g. "5000.00" */
  creditLimit: string;
  currency: string | null;
  sipUsername: string | null;
  portalEmail: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** Trunks excluding archived ones */
  trunkCount: number;
  trunksUp: number;
  trunksDown: number;
  liveCalls: number;
  calls24h: number;
  answered24h: number;
  /** Percent; null when no calls ran (not 0) */
  asr24h: number | null;
  /** US dollars as a JSON number (computed figure) */
  revenue24h: number;
  /** US dollars as a JSON number (computed figure) */
  margin24h: number;
  marginPct24h: number | null;
  pddMs24h: number | null;
  creditUsedPct: number | null;
  contact: {
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  /** Open operational issues. Null means the check could not run, not that nothing is wrong. */
  attention: {
    highest: string | null;
    open: number;
    unacknowledged: number;
    refs: Array<string>;
    [key: string]: unknown;
  } | null;
  setup: {
    trunks: number;
    enabled: number;
    identified: number;
    routed: number;
    unrouted: number;
  };
  refused24h: {
    forbidden: number;
    capacity: number;
  };
  /** Filterable problem and state flags, e.g. "problem:no_traffic" */
  flags: Array<string>;
  [key: string]: unknown;
}

export interface SwitchCustomerCreated {
  id: string;
  label: string;
  source: "marketplace" | "external";
  status: "draft" | "active" | "suspended" | "closed";
  externalRef: string | null;
  /** Prepaid wallet balance (negative = owed), 6-decimal USD string */
  balance: Money;
  /** USD decimal string as stored (2 decimal places), e.g. "5000.00" */
  creditLimit: string;
  currency: string | null;
  /** Default markup over cost, percent as a decimal string */
  markupPct: string | null;
  /** e.g. "60/60" or "6/6" */
  billingIncrement: string | null;
  minMarginPct: string | null;
  marginFloorAction: ("block" | "alert") | null;
  /** USD decimal string as stored (2 decimal places), e.g. "5000.00" */
  dailySpendCap: string | null;
  maxConcurrentCalls: number | null;
  maxCps: number | null;
  blockedPrefixes: Array<string> | null;
  sipUsername: string | null;
  portalEmail: string | null;
  taxCountry: string | null;
  taxId: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  /** The inbound SIP password in plain text. Returned ONCE, here. */
  sipPassword: string;
  /** The "Default" trunk created with every customer */
  defaultTrunkId: string;
  /** The customer's first API key. Returned ONCE, here. */
  apiKey: string;
  apiKeyPrefix: string;
  [key: string]: unknown;
}

export interface SwitchCustomerSipCredentials {
  sipUsername: string | null;
  sipPassword: string | null;
}

export interface SwitchCustomerLifecycleEntry {
  id: string;
  /** ISO-8601 timestamp (UTC) */
  at: string;
  action: string;
  from: string | null;
  to: string | null;
  reason: string | null;
  /** Email of whoever did it */
  actor: string | null;
  detail: {
    [key: string]: unknown;
  };
}

export interface SwitchCustomerLifecycle {
  customer: {
    id: string;
    label: string;
    status: "draft" | "active" | "suspended" | "closed";
    source: string;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
  };
  /** Actions allowed from the current state */
  available: Array<"activate" | "suspend" | "reactivate" | "close" | "reopen">;
  liveCalls: number;
  trunks: {
    total: number;
    active: number;
  };
  history: Array<SwitchCustomerLifecycleEntry>;
  financials: {
    currency: string;
    /** US dollars as a JSON number (computed figure) */
    prepaidBalance: number;
    /** US dollars as a JSON number (computed figure) */
    invoicesOutstanding: number;
    /** US dollars as a JSON number (computed figure) */
    invoicesOverdue: number;
    /** US dollars as a JSON number (computed figure) */
    creditNotesOpen: number;
    /** US dollars as a JSON number (computed figure) */
    unbilledUsage: number;
    /** US dollars as a JSON number (computed figure) */
    creditLimit: number;
    openInvoiceCount: number;
    paidInvoiceCount: number;
    paymentCount: number;
    hasOpenPosition: boolean;
  };
  canDelete: boolean;
  deleteBlockers: Array<string>;
}

export interface SwitchCustomerOverview {
  customer: {
    id: string;
    label: string;
    status: "draft" | "active" | "suspended" | "closed";
    source: string;
    [key: string]: unknown;
  };
  /** Balance owed, wallet, credit used and today's traffic figures (numbers) */
  kpis: {
    [key: string]: unknown;
  };
  commercial: {
    [key: string]: unknown;
  };
  activity: Array<{
    [key: string]: unknown;
  }>;
  topDestinationsToday: Array<{
    [key: string]: unknown;
  }>;
  health?: unknown;
  setup?: unknown;
  reconciliation?: unknown;
  freshness?: unknown;
  [key: string]: unknown;
}

export interface SwitchCustomerQuality {
  windowHours: number;
  window: {
    /** ISO-8601 timestamp (UTC) */
    from: string;
    /** ISO-8601 timestamp (UTC) */
    to: string;
    label: string;
  };
  destinationDigits: number;
  kpis: {
    calls: number;
    answered: number;
    asr: number | null;
    ner: number | null;
    [key: string]: unknown;
  };
  destinations: Array<{
    prefix: string;
    calls: number;
    answered: number;
    asr: number | null;
    ner: number | null;
    health: string;
    [key: string]: unknown;
  }>;
  thresholds?: unknown;
  minJudgeableSessions: number;
  /** Call Records filter ids this view honours */
  supports: Array<string>;
  /** Filters you sent that this view could not apply */
  unsupported: Array<unknown>;
  [key: string]: unknown;
}

export interface SwitchCustomerContact {
  id: string;
  subAccountId: string;
  name: string;
  role: "technical" | "noc" | "billing" | "escalation" | "commercial";
  email: string | null;
  phone: string | null;
  /** 1 = try first within this role */
  priority: number;
  isPrimary: boolean;
  preferredMethod: "email" | "phone" | "either";
  availability: ("24x7" | "business_hours" | "on_call") | null;
  timezone: string | null;
  notes: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchCustomerNote {
  id: string;
  subAccountId: string;
  body: string;
  type: "general" | "technical" | "billing" | "warning";
  pinned: boolean;
  /** ISO-8601 timestamp (UTC) */
  followUpAt: string | null;
  createdBy: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchCustomerAttentionItem {
  kind: "quality" | "commercial" | "credit" | "config" | "setup";
  title: string;
  detail: string;
  at: string;
  actionable: boolean;
  [key: string]: unknown;
}

export interface SwitchCustomerIssue {
  /** Issue reference, e.g. OPS-1042 */
  ref: string;
  detector: string;
  severity: string;
  status: string;
  title: string;
  summary: string;
  trigger: string;
  recovery: string;
  sampleSize: number;
  evidence: Array<{
    label: string;
    value: string;
  }>;
  firstDetectedAt: string;
  lastDetectedAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  [key: string]: unknown;
}

export interface SwitchCustomerBillingSummary {
  /** Open invoices less open credit notes */
  balanceOwed: number;
  /** US dollars as a JSON number (computed figure) */
  grossBalanceOwed: number;
  /** US dollars as a JSON number (computed figure) */
  creditNotesOpen: number;
  /** US dollars as a JSON number (computed figure) */
  paymentsRecorded: number;
  /** US dollars as a JSON number (computed figure) */
  creditLimit: number;
  /** US dollars as a JSON number (computed figure) */
  unbilledRated: number;
  /** US dollars as a JSON number (computed figure) */
  unbilledSinceLastInvoice: number;
  unratedUsage: {
    calls: number;
    minutes: number | null;
    note: string;
  };
  overdueIsSubsetOfOpenInvoices: true;
  /** Customer-side disputes are not recorded, so always null */
  disputed: "null" | null;
  avgDaysToPay: number | null;
  /** ISO-8601 timestamp (UTC) */
  lastInvoicePeriodEnd: string | null;
  currency: string;
  aging: {
    /** US dollars as a JSON number (computed figure) */
    current: number;
    /** US dollars as a JSON number (computed figure) */
    d1_30: number;
    /** US dollars as a JSON number (computed figure) */
    d31_60: number;
    /** US dollars as a JSON number (computed figure) */
    d61_90: number;
    /** US dollars as a JSON number (computed figure) */
    d90_plus: number;
  };
  [key: string]: unknown;
}

export interface SwitchCustomerCreditPosition {
  customerId: string;
  label: string;
  currency: string;
  /** prepaid or postpaid, derived from the credit limit */
  mode: string;
  creditLimit: {
    /** US dollars as a JSON number (computed figure) */
    value: number;
    ambiguous: string | null;
  };
  /** US dollars as a JSON number (computed figure) */
  exposure: number;
  /** US dollars as a JSON number (computed figure) */
  balance: number;
  reservations: {
    /** US dollars as a JSON number (computed figure) */
    amount: number;
    calls: number;
    enforced: boolean;
    basis: string;
  };
  /** US dollars as a JSON number (computed figure) */
  availableCredit: number;
  /** US dollars as a JSON number (computed figure) */
  availableAfterReservations: number;
  admitsNextCall: boolean;
  usedPct: number | null;
  overCommitted: boolean;
  [key: string]: unknown;
}

export interface SwitchCustomerPayment {
  kind: "payment";
  transactionId: string;
  /** US dollars as a JSON number (computed figure) */
  amount: number;
  currency: string;
  /** ISO-8601 timestamp (UTC) */
  postedAt: string;
  externalReference: string | null;
  method: string | null;
  operatorLabel: string | null;
  billingMode: string;
  /** Oldest-due invoices first */
  allocations: Array<{
    invoiceId: string;
    invoiceNumber: string;
    /** US dollars as a JSON number (computed figure) */
    applied: number;
    /** US dollars as a JSON number (computed figure) */
    outstandingAfter: number;
    status: string;
    [key: string]: unknown;
  }>;
  /** Left on account after paying every open invoice */
  unapplied: number;
  positionAfter: {
    [key: string]: unknown;
  };
}

export interface SwitchCustomerInvoicePreview {
  customer: {
    id: string;
    label: string;
    legalName: string;
    currency: string;
  };
  period: {
    [key: string]: unknown;
  };
  dueDate: string;
  paymentTermsDays: number;
  currency: string;
  usage: {
    [key: string]: unknown;
  };
  /** Usage that has no price yet; blocks issue unless excluded */
  unrated: {
    [key: string]: unknown;
  };
  /** Pass to generate-invoice to issue exactly what was reviewed */
  reviewToken: string;
  reviewDigest: string;
  [key: string]: unknown;
}

export interface SwitchCustomerIssuedInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  status: string;
  subtotal: Money;
  total: Money;
  currency: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string;
  /** ISO-8601 timestamp (UTC) */
  issueDate: string | null;
  /** ISO-8601 timestamp (UTC) */
  dueDate: string | null;
  lines: Array<{
    [key: string]: unknown;
  }>;
  reviewDigest: string | null;
  [key: string]: unknown;
}

export interface SwitchCustomerBillingProfile {
  id: string;
  legalName: string;
  /** Bumped on every save; frozen onto invoices issued afterwards */
  version: number;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchCustomerSellDeckRef {
  id: string;
  name: string;
  version: number;
  status: string;
  currency: string;
  isSystemDefault: boolean;
  /** USD per minute for destinations the deck does not list; null = refuse them */
  defaultRatePerUnit: number | null;
  charging: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface SwitchTrunkEffectiveSellDeck {
  deck: SwitchCustomerSellDeckRef | null;
  mode: string;
  /** Which rule won: the trunk, the customer default or the system default */
  choice: string;
  bypassesCustomerDefault: boolean;
  customerDefault: SwitchCustomerSellDeckRef | null;
  systemDefault: SwitchCustomerSellDeckRef | null;
  liveRowCount: number;
  explanation: string;
  problem: string | null;
}

export interface SwitchCustomerSellRate {
  id: string;
  subAccountId: string;
  customerTrunkId: string | null;
  prefix: string;
  /** "" = any origin */
  originPrefix: string;
  /** Sell price per minute, 6-decimal USD string */
  ratePerUnit: Money;
  billingIncrement: string | null;
  /** active, pending (scheduled) or discontinued */
  status: string;
  /** ISO-8601 timestamp (UTC) */
  effectiveFrom: string;
  /** ISO-8601 timestamp (UTC) */
  endDate: string | null;
  [key: string]: unknown;
}

export interface SwitchCustomerSellRatePage {
  rows: Array<{
    id: string;
    subAccountId: string;
    customerTrunkId: string | null;
    prefix: string;
    /** "" = any origin */
    originPrefix: string;
    /** Sell price per minute, 6-decimal USD string */
    ratePerUnit: Money;
    billingIncrement: string | null;
    /** active, pending (scheduled) or discontinued */
    status: string;
    /** ISO-8601 timestamp (UTC) */
    effectiveFrom: string;
    /** ISO-8601 timestamp (UTC) */
    endDate: string | null;
    /** Best eligible buy cost per minute (USD number); null = no supplier prices it */
    buyCost: number | null;
    marginPct: number | null;
    thin: boolean;
    negative: boolean;
    costSupplier: string | null;
    costSource: string;
    costMatchedPrefix: string | null;
    costNote: string | null;
    [key: string]: unknown;
  }>;
  total: number;
  /** True when a cost or margin filter narrowed the page, so `total` counts this page only */
  totalIsPageScoped: boolean;
  limit: number;
  offset: number;
  view: string;
  summary: {
    prefixes: number;
    blendedMarginPct: number | null;
    thinCount: number;
    negativeCount: number;
    defaultRateCostCount: number;
    unpricedCount: number;
  };
  basis?: unknown;
}

export interface SwitchCustomerTrunk {
  id: string;
  /** The customer this trunk belongs to */
  subAccountId: string;
  label: string;
  status: "active" | "disabled" | "archived";
  authMode?: "ip" | "credentials" | "ip_and_credentials" | "registration" | "certificate";
  sipUsername: string | null;
  sipPasswordSet: boolean;
  /** Null inherits the customer ceiling */
  maxConcurrentCalls: number | null;
  maxCps: number | null;
  markupPct: string | null;
  billingIncrement: string | null;
  techPrefix: string | null;
  mediaMode?: "proxy" | "direct";
  cliRewrite: {
    [key: string]: unknown;
  } | null;
  allowedPrefixes: Array<string> | null;
  allowedCountries: Array<string> | null;
  blockedCountries: Array<string> | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchCustomerTrunkListRow {
  id: string;
  /** The customer this trunk belongs to */
  subAccountId: string;
  label: string;
  status: "active" | "disabled" | "archived";
  authMode?: "ip" | "credentials" | "ip_and_credentials" | "registration" | "certificate";
  sipUsername: string | null;
  sipPasswordSet: boolean;
  /** Null inherits the customer ceiling */
  maxConcurrentCalls: number | null;
  maxCps: number | null;
  markupPct: string | null;
  billingIncrement: string | null;
  techPrefix: string | null;
  mediaMode?: "proxy" | "direct";
  cliRewrite: {
    [key: string]: unknown;
  } | null;
  allowedPrefixes: Array<string> | null;
  allowedCountries: Array<string> | null;
  blockedCountries: Array<string> | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  authentication: {
    mode: "ip" | "credentials" | "ip_and_credentials" | "registration" | "certificate";
    title: string;
    summary: string;
    sends: Array<string>;
    checks: Array<string>;
    /** Empty when the trunk is configured for its declared mode */
    gaps: Array<string>;
    enforced: boolean;
  };
  identification: {
    namedBy: Array<string>;
    unique: boolean;
    note: string | null;
  };
  allowedIps: Array<string>;
  allowedAddresses: Array<{
    id: string;
    cidr: string;
  }>;
  routing: {
    [key: string]: unknown;
  } | null;
  inherited: {
    from: "customer";
    maxConcurrentCalls: number | null;
    maxCps: number | null;
    billingIncrement: string | null;
  };
  last24h: {
    calls: number;
    minutes: number;
    /** US dollars as a JSON number (computed figure) */
    revenue: number;
  };
  /** The window the traffic figures cover */
  period?: unknown;
  traffic: {
    calls: number;
    answered: number;
    minutes: number;
    /** US dollars as a JSON number (computed figure) */
    revenue: number;
    /** US dollars as a JSON number (computed figure) */
    margin: number;
    asr: number | null;
    pddMs: number | null;
  };
  refused: {
    forbidden: number;
    capacity: number;
    capacityChannels: number;
    capacityCps: number;
  };
  [key: string]: unknown;
}

export interface SwitchTrunkAddressPanel {
  trunkId: string;
  trunkLabel: string;
  customerId: string;
  entries: Array<{
    id: string;
    cidr: string;
    canonical: string | null;
    description: string | null;
    ambiguous?: boolean;
    [key: string]: unknown;
  }>;
  /** Addresses added on the customer, which apply to every trunk */
  customerLevel: Array<{
    [key: string]: unknown;
  }>;
  ambiguousCount: number;
  activation: {
    appliesTo: "new_requests";
    affectsCallsInProgress: false;
    note: string;
  };
}

export interface SwitchCustomerRoutingAssignment {
  subAccountId: string;
  customerTrunkId?: string | null;
  dialplanId: string | null;
  routePlanId: string | null;
  failoverRoutePlanId: string | null;
  strategyOverride: string | null;
  directRouteId: string | null;
  directVendorTrunkId: string | null;
  [key: string]: unknown;
}

export interface SwitchTrunkCredentialStatus {
  trunkId: string;
  trunkLabel: string;
  customerId: string;
  customerLabel: string | null;
  username: string | null;
  passwordSet: boolean;
  storage: {
    sealed: boolean;
    note: string;
  };
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  lastChange?: unknown;
  lastReveal?: unknown;
  historyAvailable: boolean;
  lastSuccessfulAuth: {
    at: string;
    sourceIp: string | null;
    sourceIsRegistered: boolean;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface SwitchTrunkEffectiveConfig {
  trunk: {
    id: string;
    label: string;
    status: string;
    customerId: string;
    customerLabel: string;
  };
  /** Each setting with the value in force and the level it came from */
  sections: Array<{
    [key: string]: unknown;
  }>;
  capacity: {
    limits: Array<{
      [key: string]: unknown;
    }>;
    refusals?: unknown;
    checkOrder: Array<string>;
    note: string;
  };
  readOnly: true;
}

export interface SwitchCustomerRateNotice {
  /** Days of notice before a sell-rate increase takes effect; 0 = none */
  rateNoticeDays: number;
  /** Sell-rate changes queued and not yet in effect */
  queued: number;
  /** How many of the queued changes are increases */
  increases: number;
  /** When the soonest queued change takes effect */
  nextEffectiveFrom: string | null;
  /** Who a notice goes to when you do not name recipients */
  defaultRecipients: Array<string>;
}

export interface SwitchCustomerRateChange {
  /** The customer trunk's label ("" when it has none) */
  trunk: string;
  prefix: string;
  /** Origin prefix for origin-based pricing; "" when the rate applies from any origin */
  origin: string;
  /** The rate in force today; null for a new destination */
  currentRate: Money | null;
  newRate: Money;
  /** Percentage move, 2 decimals; null for a new destination */
  changePct: number | null;
  currentIncrement: string | null;
  newIncrement: string | null;
  /** ISO-8601 timestamp (UTC) */
  effectiveFrom: string;
}

/** A supplier (vendor) trunk. Carries every spec section-4 policy field accepted on create/update; secrets are replaced by *Set booleans. */
export interface SwitchSupplierTrunk {
  id: string;
  /** The owning provider; null = ungrouped */
  supplierId: string | null;
  label: string;
  /** "external" for a carrier you entered; "marketplace" for a trunk promoted from a marketplace purchase */
  source: string;
  status: "active" | "disabled" | "draft" | "testing" | "draining" | "fault";
  /** Null on a marketplace trunk: the seller address is never disclosed */
  sipHost: string | null;
  sipPort: number | null;
  transport: ("udp" | "tcp" | "tls") | null;
  techPrefix: string | null;
  sipAuthUsername: string | null;
  /** Whether a SIP password is stored. The value is only readable via GET /switch/suppliers/{id}/credentials */
  sipAuthPasswordSet: boolean;
  smppPasswordSet: boolean;
  mediaMode: "proxy" | "direct";
  /** Cost per minute used when no deck row matches */
  defaultRatePerUnit: Money | null;
  billingIncrement: string | null;
  currency: string | null;
  /** Max concurrent channels */
  capacity: number | null;
  maxCps: number | null;
  settlementMode: "ap" | "prepaid";
  /** Prepaid credit remaining with this supplier (prepaid settlement) */
  balance: Money;
  smsDeliveryMethod: ("http" | "smpp") | null;
  reachable: boolean | null;
  /** ISO-8601 timestamp (UTC) */
  reachCheckedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

/** A supplier (vendor) trunk. Carries every spec section-4 policy field accepted on create/update; secrets are replaced by *Set booleans. */
export interface SwitchSupplierTrunkDetail {
  id: string;
  /** The owning provider; null = ungrouped */
  supplierId: string | null;
  label: string;
  /** "external" for a carrier you entered; "marketplace" for a trunk promoted from a marketplace purchase */
  source: string;
  status: "active" | "disabled" | "draft" | "testing" | "draining" | "fault";
  /** Null on a marketplace trunk: the seller address is never disclosed */
  sipHost: string | null;
  sipPort: number | null;
  transport: ("udp" | "tcp" | "tls") | null;
  techPrefix: string | null;
  sipAuthUsername: string | null;
  /** Whether a SIP password is stored. The value is only readable via GET /switch/suppliers/{id}/credentials */
  sipAuthPasswordSet: boolean;
  smppPasswordSet: boolean;
  mediaMode: "proxy" | "direct";
  /** Cost per minute used when no deck row matches */
  defaultRatePerUnit: Money | null;
  billingIncrement: string | null;
  currency: string | null;
  /** Max concurrent channels */
  capacity: number | null;
  maxCps: number | null;
  settlementMode: "ap" | "prepaid";
  /** Prepaid credit remaining with this supplier (prepaid settlement) */
  balance: Money;
  smsDeliveryMethod: ("http" | "smpp") | null;
  reachable: boolean | null;
  /** ISO-8601 timestamp (UTC) */
  reachCheckedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  ipAcls: Array<SwitchIpAcl>;
  /** Warning when this address is also one of your own customers (loopback) */
  hairpin: {
    [key: string]: unknown;
  } | null;
  /** Derived health state (what routing believes), with its counters and thresholds */
  health: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface SwitchTrunkEndpoint {
  id: string;
  vendorTrunkId: string;
  role: "primary" | "backup";
  /** Null on a marketplace trunk */
  host: string | null;
  port: number | null;
  transport: "udp" | "tcp" | "tls";
  priority: number;
  weightPct: number | null;
  enabled: boolean;
  optionsIntervalSeconds: number | null;
  failureThreshold: number;
  recoveryThreshold: number;
  autoDisable: boolean;
  reachable: boolean | null;
  reachLatencyMs: number | null;
  /** ISO-8601 timestamp (UTC) */
  reachCheckedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  healthDisabledAt: string | null;
  /** Derived health state (what routing believes), with its counters and thresholds */
  health: {
    [key: string]: unknown;
  };
  flap?: {
    [key: string]: unknown;
  } | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchSmsEndpointTest {
  pass: boolean;
  via: "http" | "smpp";
  checks: Array<{
    label: string;
    value: string;
    ok: boolean;
  }>;
  message: string;
}

export interface SwitchTrunkRate {
  id: string;
  vendorTrunkId: string;
  prefix: string;
  /** Caller-origin prefix; "" = any origin */
  originPrefix: string;
  /** Cost per minute */
  ratePerUnit: Money;
  destinationName: string | null;
  /** e.g. "6/6"; null inherits the trunk default */
  billingIncrement: string | null;
  status: ("active" | "pending" | "superseded" | "archived") | string;
  /** ISO-8601 timestamp (UTC) */
  effectiveFrom: string | null;
  [key: string]: unknown;
}

export interface SwitchTrunkChangeRequest {
  id: string;
  vendorTrunkId: string;
  trunkLabel: string | null;
  status: ("pending" | "approved" | "rejected" | "withdrawn" | "applied") | string;
  fields: Array<string>;
  /** Secret fields show "(secret)", never their value */
  changes: Array<{
    field: string;
    from?: unknown;
    to?: unknown;
  }>;
  patch: {
    [key: string]: unknown;
  };
  beforeValues: {
    [key: string]: unknown;
  };
  note: string | null;
  requestedBy: string;
  requestedByEmail: string | null;
  /** ISO-8601 timestamp (UTC) */
  requestedAt: string;
  reviewedBy: string | null;
  /** ISO-8601 timestamp (UTC) */
  reviewedAt: string | null;
  reviewNote: string | null;
  /** ISO-8601 timestamp (UTC) */
  appliedAt: string | null;
  [key: string]: unknown;
}

export interface SwitchTrunkReadiness {
  trunkId: string;
  exempt: boolean;
  exemptReason: string | null;
  state: "ready" | "not_ready" | "exempt";
  checks: Array<{
    id: string;
    spec: string;
    title: string;
    /** pass, warn or fail */
    status: string;
    evidence: string;
    fix: "supplier" | "contacts" | "endpoints" | "configuration" | "cost_deck" | "diagnostics" | "settings" | "routing";
  }>;
  failing: number;
  warning: number;
  grandfathered: boolean;
  blockingEnabled: boolean;
}

export interface SwitchTrunkConfigVersion {
  id: string;
  version: number;
  /** Which door the change came through, e.g. update, approval, api */
  source: string;
  changedFields: Array<string>;
  diff: {
    [key: string]: {
      from?: unknown;
      to?: unknown;
    };
  } | null;
  note: string | null;
  checksum: string | null;
  changeRequestId: string | null;
  actorUserId: string | null;
  actorEmail?: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface SwitchIpAcl {
  id: string;
  entityType: "customer" | "trunk";
  entityId: string;
  cidr: string;
  description: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  [key: string]: unknown;
}

export interface SwitchProvider {
  id: string;
  name: string;
  accountCode: string | null;
  legalName: string | null;
  tradingName: string | null;
  providerType: ("carrier" | "aggregator" | "mno" | "mvno" | "sip_provider") | null;
  country: string | null;
  services: Array<string> | null;
  portalEmail: string | null;
  currency: string;
  status: "draft" | "pending_approval" | "testing" | "active" | "suspended" | "terminated";
  statusNote: string | null;
  /** ISO-8601 timestamp (UTC) */
  statusChangedAt: string | null;
  /** Whether this provider admits new calls at all, given its status */
  routable: boolean;
  /** YYYY-MM-DD */
  contractStart: string | null;
  contractEnd: string | null;
  autoRenew: boolean;
  rateNoticeDays: number | null;
  disputeDays: number | null;
  billingMode: "prepaid" | "postpaid";
  /** Decimal string with 2 decimal places, e.g. "5000.00" */
  creditLimit: string | null;
  balance: Money;
  paymentTermsDays: number | null;
  invoiceCycle: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchProviderList {
  accounts: Array<{
    id: string;
    name: string;
    accountCode: string | null;
    legalName: string | null;
    tradingName: string | null;
    providerType: ("carrier" | "aggregator" | "mno" | "mvno" | "sip_provider") | null;
    country: string | null;
    services: Array<string> | null;
    portalEmail: string | null;
    currency: string;
    status: "draft" | "pending_approval" | "testing" | "active" | "suspended" | "terminated";
    statusNote: string | null;
    /** ISO-8601 timestamp (UTC) */
    statusChangedAt: string | null;
    /** Whether this provider admits new calls at all, given its status */
    routable: boolean;
    /** YYYY-MM-DD */
    contractStart: string | null;
    contractEnd: string | null;
    autoRenew: boolean;
    rateNoticeDays: number | null;
    disputeDays: number | null;
    billingMode: "prepaid" | "postpaid";
    /** Decimal string with 2 decimal places, e.g. "5000.00" */
    creditLimit: string | null;
    balance: Money;
    paymentTermsDays: number | null;
    invoiceCycle: string | null;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
    /** ISO-8601 timestamp (UTC) */
    updatedAt: string;
    trunks: Array<{
      id: string;
      /** The owning provider; null = ungrouped */
      supplierId: string | null;
      label: string;
      /** "external" for a carrier you entered; "marketplace" for a trunk promoted from a marketplace purchase */
      source: string;
      status: "active" | "disabled" | "draft" | "testing" | "draining" | "fault";
      /** Null on a marketplace trunk: the seller address is never disclosed */
      sipHost: string | null;
      sipPort: number | null;
      transport: ("udp" | "tcp" | "tls") | null;
      techPrefix: string | null;
      sipAuthUsername: string | null;
      /** Whether a SIP password is stored. The value is only readable via GET /switch/suppliers/{id}/credentials */
      sipAuthPasswordSet: boolean;
      smppPasswordSet: boolean;
      mediaMode: "proxy" | "direct";
      /** Cost per minute used when no deck row matches */
      defaultRatePerUnit: Money | null;
      billingIncrement: string | null;
      currency: string | null;
      /** Max concurrent channels */
      capacity: number | null;
      maxCps: number | null;
      settlementMode: "ap" | "prepaid";
      /** Prepaid credit remaining with this supplier (prepaid settlement) */
      balance: Money;
      smsDeliveryMethod: ("http" | "smpp") | null;
      reachable: boolean | null;
      /** ISO-8601 timestamp (UTC) */
      reachCheckedAt: string | null;
      /** ISO-8601 timestamp (UTC) */
      createdAt: string;
      /** ISO-8601 timestamp (UTC) */
      updatedAt: string;
      endpointCount: number;
      endpointsEnabled: number;
      [key: string]: unknown;
    }>;
    trunkCount: number;
    activeTrunks: number;
    totalCapacity: number;
    [key: string]: unknown;
  }>;
  ungrouped: Array<{
    id: string;
    /** The owning provider; null = ungrouped */
    supplierId: string | null;
    label: string;
    /** "external" for a carrier you entered; "marketplace" for a trunk promoted from a marketplace purchase */
    source: string;
    status: "active" | "disabled" | "draft" | "testing" | "draining" | "fault";
    /** Null on a marketplace trunk: the seller address is never disclosed */
    sipHost: string | null;
    sipPort: number | null;
    transport: ("udp" | "tcp" | "tls") | null;
    techPrefix: string | null;
    sipAuthUsername: string | null;
    /** Whether a SIP password is stored. The value is only readable via GET /switch/suppliers/{id}/credentials */
    sipAuthPasswordSet: boolean;
    smppPasswordSet: boolean;
    mediaMode: "proxy" | "direct";
    /** Cost per minute used when no deck row matches */
    defaultRatePerUnit: Money | null;
    billingIncrement: string | null;
    currency: string | null;
    /** Max concurrent channels */
    capacity: number | null;
    maxCps: number | null;
    settlementMode: "ap" | "prepaid";
    /** Prepaid credit remaining with this supplier (prepaid settlement) */
    balance: Money;
    smsDeliveryMethod: ("http" | "smpp") | null;
    reachable: boolean | null;
    /** ISO-8601 timestamp (UTC) */
    reachCheckedAt: string | null;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
    /** ISO-8601 timestamp (UTC) */
    updatedAt: string;
    endpointCount: number;
    endpointsEnabled: number;
    [key: string]: unknown;
  }>;
}

export interface SwitchProviderContact {
  id: string;
  supplierId: string;
  role: "noc" | "rates" | "billing" | "finance" | "fraud" | "account" | "emergency";
  name: string | null;
  email: string | null;
  phone: string | null;
  timezone: string | null;
  notify: boolean;
  notes: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface SwitchProviderDetail {
  id: string;
  name: string;
  accountCode: string | null;
  legalName: string | null;
  tradingName: string | null;
  providerType: ("carrier" | "aggregator" | "mno" | "mvno" | "sip_provider") | null;
  country: string | null;
  services: Array<string> | null;
  portalEmail: string | null;
  currency: string;
  status: "draft" | "pending_approval" | "testing" | "active" | "suspended" | "terminated";
  statusNote: string | null;
  /** ISO-8601 timestamp (UTC) */
  statusChangedAt: string | null;
  /** Whether this provider admits new calls at all, given its status */
  routable: boolean;
  /** YYYY-MM-DD */
  contractStart: string | null;
  contractEnd: string | null;
  autoRenew: boolean;
  rateNoticeDays: number | null;
  disputeDays: number | null;
  billingMode: "prepaid" | "postpaid";
  /** Decimal string with 2 decimal places, e.g. "5000.00" */
  creditLimit: string | null;
  balance: Money;
  paymentTermsDays: number | null;
  invoiceCycle: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  contacts: Array<SwitchProviderContact>;
  trunks: Array<{
    id: string;
    /** The owning provider; null = ungrouped */
    supplierId: string | null;
    label: string;
    /** "external" for a carrier you entered; "marketplace" for a trunk promoted from a marketplace purchase */
    source: string;
    status: "active" | "disabled" | "draft" | "testing" | "draining" | "fault";
    /** Null on a marketplace trunk: the seller address is never disclosed */
    sipHost: string | null;
    sipPort: number | null;
    transport: ("udp" | "tcp" | "tls") | null;
    techPrefix: string | null;
    sipAuthUsername: string | null;
    /** Whether a SIP password is stored. The value is only readable via GET /switch/suppliers/{id}/credentials */
    sipAuthPasswordSet: boolean;
    smppPasswordSet: boolean;
    mediaMode: "proxy" | "direct";
    /** Cost per minute used when no deck row matches */
    defaultRatePerUnit: Money | null;
    billingIncrement: string | null;
    currency: string | null;
    /** Max concurrent channels */
    capacity: number | null;
    maxCps: number | null;
    settlementMode: "ap" | "prepaid";
    /** Prepaid credit remaining with this supplier (prepaid settlement) */
    balance: Money;
    smsDeliveryMethod: ("http" | "smpp") | null;
    reachable: boolean | null;
    /** ISO-8601 timestamp (UTC) */
    reachCheckedAt: string | null;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
    /** ISO-8601 timestamp (UTC) */
    updatedAt: string;
    endpoints: Array<SwitchTrunkEndpoint>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface SwitchProviderDispute {
  id: string;
  supplierId: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string | null;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string | null;
  /** Decimal string with 2 decimal places, e.g. "5000.00" */
  ourAmount: string | null;
  /** Decimal string with 2 decimal places, e.g. "5000.00" */
  theirAmount: string | null;
  currency: string;
  status: "open" | "submitted" | "accepted" | "rejected" | "settled" | "withdrawn";
  reason: string | null;
  resolution: string | null;
  invoiceRef: string | null;
  /** ISO-8601 timestamp (UTC) */
  openedAt: string;
  /** ISO-8601 timestamp (UTC) */
  respondBy: string | null;
  /** ISO-8601 timestamp (UTC) */
  closedAt: string | null;
  /** Days left to respond (list only); negative = the window has passed */
  daysLeft?: number | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchSbcProfile {
  trunkId: string;
  trunkLabel: string;
  profileLevel: Array<{
    endpointId: string;
    host: string;
    settings: Array<string>;
  }>;
  /** Gateway configuration to place on the SBC */
  xml: string;
  applyNote: string;
}

export interface SwitchCounterparty {
  id: string;
  name: string;
  /** The customer side of this counterparty */
  customerId: string | null;
  /** The supplier side of this counterparty */
  vendorTrunkId: string | null;
  currency: string;
  nettingEnabled: boolean;
  notes: string | null;
  customerLabel?: string | null;
  trunkLabel?: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

/** A price, or the reason there is none. Only kind = rated carries a rate. */
export interface SwitchRatingOutcome {
  kind: "rated" | "no_matching_rate" | "not_yet_effective" | "expired" | "forbidden" | "rating_failed" | "not_billable";
  /** Present when kind = rated. May legitimately be 0. */
  rate?: number;
  matchedPrefix?: string;
  deckVersion?: number | null;
  source?: string;
  destination?: string;
  effectiveFrom?: string;
  expiredAt?: string;
  /** Why it is forbidden or failed */
  reason?: string;
}

/** What a change does to live pricing, with the biggest movers */
export interface SwitchRateDeckDiff {
  removalMode: "merge" | "replace";
  changeMode: "amendment" | "full_replacement";
  /** Prefixes priced on the live deck now */
  live: number;
  /** Prefixes the new rows price */
  incoming: number;
  added: number;
  changed: number;
  rateChanged: number;
  /** Changed rows where only the billing increment moved */
  incrementOnly: number;
  unchanged: number;
  /** Live prefixes the new rows do not mention */
  removed: number;
  [key: string]: unknown;
}

export interface SwitchRateDeck {
  id: string;
  /** The provider who sent it; null for a deck recorded before its provider was */
  supplierId: string | null;
  name: string;
  currency: string;
  version: number;
  status: "draft" | "uploaded" | "invalid" | "validated" | "pending_approval" | "scheduled" | "active" | "expired" | "rolled_back";
  /** ISO-8601 timestamp (UTC) */
  effectiveFrom: string | null;
  /** ISO-8601 timestamp (UTC) */
  expiresAt: string | null;
  source: ("portal" | "csv" | "api" | "email" | "sftp") | null;
  sourceRef: string | null;
  /** ISO-8601 timestamp (UTC) */
  approvedAt: string | null;
  /** The last validation result; null before the deck is validated */
  validation: {
    checkedAt: string;
    rows: number;
    destinations: number;
    errors: Array<{
      [key: string]: unknown;
    }>;
    warnings: Array<{
      [key: string]: unknown;
    }>;
    maxIncreasePct?: number;
  } | null;
  supersedesId: string | null;
  /** ISO-8601 timestamp (UTC) */
  rolledBackAt: string | null;
  notes: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  rowCount: number;
  /** Supplier trunks the deck prices */
  trunks: Array<{
    id: string;
    label: string;
  }>;
  /** Whether rows can still be edited */
  mutable: boolean;
  [key: string]: unknown;
}

export interface SwitchDeckSheetResult {
  targetLabel: string;
  rowCount?: number;
  currency: string;
  warnings: Array<{
    [key: string]: unknown;
  }>;
  /** What a change does to live pricing, with the biggest movers */
  diff?: SwitchRateDeckDiff;
  /** Rows written (apply) or queued (scheduled apply) */
  applied?: number;
  replaced?: boolean;
  /** Present when a future effectiveFrom queued the sheet */
  scheduled?: true;
  effectiveFrom?: string;
  /** Origin-scoped live rows a sheet cannot express, counted not changed */
  originScoped?: number;
  overLimit?: boolean;
  maxRows?: number;
  [key: string]: unknown;
}

export interface SwitchSellDeck {
  id: string;
  name: string;
  version: number;
  status: "draft" | "active" | "superseded" | "archived";
  currency: string;
  isSystemDefault: boolean;
  /** Catch-all price for destinations the deck does not list (a JSON number) */
  defaultRatePerUnit: number | null;
  charging: {
    minimumDurationSeconds: number | null;
    firstIntervalSeconds: number | null;
    subsequentIntervalSeconds: number | null;
    /** Per-call setup fee (a JSON number) */
    setupFee: number | null;
    graceSeconds: number | null;
    rounding: ("up" | "nearest" | "down") | null;
  };
  [key: string]: unknown;
}

export interface SwitchSellDeckRow {
  id: string;
  deckId: string;
  prefix: string;
  /** "" = any origin */
  originPrefix: string;
  ratePerUnit: Money;
  /** null = inherit the trunk or customer default */
  billingIncrement: string | null;
  destinationName: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchSellRate {
  id: string;
  prefix: string;
  /** "" = any origin */
  originPrefix: string;
  ratePerUnit: Money;
  /** null = inherit the trunk default */
  billingIncrement: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchEligibleSupplier {
  vendorTrunkId: string;
  label: string;
  status: string;
  via: Array<{
    source: "fixed target" | "route group" | "failover group" | "dialplan rule";
    groupId: string | null;
    groupName: string | null;
    prefix: string | null;
    priority: number | null;
  }>;
  /** US dollars as a decimal string with exactly 6 decimal places, e.g. "0.012500". Do money arithmetic with a decimal type, not floating point. */
  defaultRatePerUnit: Money | null;
  activeRateRows: number;
  /** True when the trunk has no rates and no default: calls to it cannot be costed */
  unpriced: boolean;
  billingIncrement: string;
  [key: string]: unknown;
}

export interface SwitchCostAnalysis {
  /** ISO-8601 timestamp (UTC) */
  at: string;
  /** The destination, routed number, origin, customer, trunk and reference call length used */
  input: {
    [key: string]: unknown;
  };
  basis: {
    resolved: boolean;
    detail: string;
    routingKind: "fixed" | "group" | "dialplan" | "none";
    routingName: string | null;
    selectionMode: string | null;
    maxAttempts: number | null;
    [key: string]: unknown;
  };
  sell: {
    /** A price, or the reason there is none. Only kind = rated carries a rate. */
    outcome: SwitchRatingOutcome | null;
    /** USD as a JSON number (engine output, up to 6 decimal places) */
    billingRate: number | null;
    matchedPrefix: string | null;
    billingIncrement: string;
    [key: string]: unknown;
  };
  suppliers: Array<{
    vendorTrunkId: string | null;
    label: string;
    kind: "supplier trunk" | "marketplace route";
    /** Attempt position in the failover chain; null if past the attempt ceiling */
    chainOrdinal: number | null;
    /** A price, or the reason there is none. Only kind = rated carries a rate. */
    outcome: SwitchRatingOutcome | null;
    /** USD as a JSON number (engine output, up to 6 decimal places) */
    billingRate: number | null;
    source: "supplier deck" | "trunk default" | "marketplace listing" | "unpriced";
    matchedPrefix: string | null;
    deckId: string | null;
    deckVersion: number | null;
    billingIncrement: string;
    excluded: {
      stage: string;
      reason: string;
      detail: string;
    } | null;
    [key: string]: unknown;
  }>;
  selected: {
    vendorTrunkId: string | null;
    label: string;
    kind: "supplier trunk" | "marketplace route";
    /** Attempt position in the failover chain; null if past the attempt ceiling */
    chainOrdinal: number | null;
    /** A price, or the reason there is none. Only kind = rated carries a rate. */
    outcome: SwitchRatingOutcome | null;
    /** USD as a JSON number (engine output, up to 6 decimal places) */
    billingRate: number | null;
    source: "supplier deck" | "trunk default" | "marketplace listing" | "unpriced";
    matchedPrefix: string | null;
    deckId: string | null;
    deckVersion: number | null;
    billingIncrement: string;
    excluded: {
      stage: string;
      reason: string;
      detail: string;
    } | null;
    [key: string]: unknown;
  } | null;
  configuredMargin: {
    kind: "configured_estimate";
    /** USD as a JSON number (engine output, up to 6 decimal places) */
    perMinute: number | null;
    perMinutePct: number | null;
    /** Revenue, cost and margin of a call of the reference length, increment-aware (JSON numbers) */
    referenceCall: {
      [key: string]: unknown;
    } | null;
    range: {
      [key: string]: unknown;
    } | null;
    explain: Array<{
      label: string;
      value: string;
      note?: string;
      source?: string;
    }>;
    [key: string]: unknown;
  };
  /** The route trace this analysis ran on */
  traceId: string;
  verdict: {
    [key: string]: unknown;
  };
  sideEffects: {
    createdCdr: false;
    movedBalance: false;
    consumedCapacity: false;
  };
  [key: string]: unknown;
}

export interface SwitchSessionMargin {
  sessionKey: string;
  callUuid: string | null;
  /** ISO-8601 timestamp (UTC) */
  at: string;
  destination: string | null;
  destinationName: string | null;
  customerTrunkId: string | null;
  status: string | null;
  durationSeconds: number;
  billedSeconds: number | null;
  billingIncrement: string | null;
  /** USD as a JSON number (engine output, up to 6 decimal places) */
  sellRate: number | null;
  /** USD as a JSON number (engine output, up to 6 decimal places) */
  charge: number;
  /** USD as a JSON number (engine output, up to 6 decimal places) */
  bookedCost: number;
  attempts: Array<{
    ordinal: number;
    supplier: string | null;
    vendorTrunkId: string | null;
    outcome: string;
    sipStatus: number | null;
    won: boolean;
    answeredSeconds: number | null;
    /** USD as a JSON number (engine output, up to 6 decimal places) */
    buyRate: number | null;
    costBasis: "booked" | "derived" | "none";
    /** USD as a JSON number (engine output, up to 6 decimal places) */
    derivedCost: number | null;
  }>;
  /** USD as a JSON number (engine output, up to 6 decimal places) */
  attemptCost: number;
  /** USD as a JSON number (engine output, up to 6 decimal places) */
  margin: number;
  flags: Array<string>;
  [key: string]: unknown;
}

export interface SwitchRouteGroup {
  id: string;
  operatorId: string;
  name: string;
  description: string | null;
  enabled: boolean;
  /** SIP results that move the call to the next supplier */
  failoverSipCodes: Array<number>;
  /** 1 to 6 */
  maxAttempts: number;
  /** How the first supplier is picked; failover is always sequential */
  selectionMode: "priority" | "least_cost" | "weighted";
  /** null = the platform budget */
  failoverTimeoutSeconds: number | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchDialplan {
  id: string;
  operatorId: string;
  name: string;
  description: string | null;
  enabled: boolean;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchRouteTrace {
  traceId: string;
  /** ISO-8601 timestamp (UTC) */
  at: string;
  saved: boolean;
  savedNote: string | null;
  input: {
    to: string;
    cli: string | null;
    type: "voice" | "sms";
    subAccountId: string | null;
    subAccountLabel: string | null;
    customerTrunkId: string | null;
    customerTrunkLabel: string | null;
  };
  verdict: {
    /** Would the call be carried? */
    routes: boolean;
    /** What the customer's switch would receive */
    sipCode: number | null;
    reason: string | null;
    summary: string;
  };
  /** Each decision stage with its result */
  steps: Array<{
    [key: string]: unknown;
  }>;
  number: {
    dialled: string;
    digits: string;
    afterTechPrefix: string;
    translated: string;
    country: string | null;
  };
  outCli: string | null;
  /** A price, or the reason there is none. Only kind = rated carries a rate. */
  sell: SwitchRatingOutcome | null;
  /** USD as a JSON number (engine output, up to 6 decimal places) */
  sellBillingRate: number | null;
  /** Suppliers in the chain, in attempt order, with buy rate, capacity and margin */
  candidates: Array<{
    [key: string]: unknown;
  }>;
  /** Suppliers considered and not used, each with the reason */
  excluded: Array<{
    [key: string]: unknown;
  }>;
  selected: {
    [key: string]: unknown;
  } | null;
  duration: {
    seconds: number;
    boundBy: "balance" | "platform" | "trunk";
  } | null;
  sideEffects: {
    createdCdr: false;
    movedBalance: false;
    consumedCapacity: false;
  };
  [key: string]: unknown;
}

export interface SwitchPayment {
  id: string;
  amount: Money;
  method: string | null;
  reference: string | null;
  /** ISO-8601 timestamp (UTC) */
  paidAt: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  [key: string]: unknown;
}

export interface SwitchInvoice {
  id: string;
  customerId: string;
  /** Sequential per operator, gap-free */
  invoiceNumber: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string | null;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string | null;
  /** ISO-8601 timestamp (UTC) */
  issueDate: string;
  /** ISO-8601 timestamp (UTC) */
  dueDate: string | null;
  currency: string;
  subtotal: Money;
  tax: Money;
  total: Money;
  amountPaid: Money;
  status: "draft" | "open" | "partial" | "paid" | "overdue" | "void";
  overdue: boolean;
  notes: string | null;
  replacesInvoiceId?: string | null;
  /** ISO-8601 timestamp (UTC) */
  sentAt?: string | null;
  sendCount?: number;
  /** On list rows */
  customerLabel?: string | null;
  [key: string]: unknown;
}

export interface SwitchInvoiceDetail {
  id: string;
  customerId: string;
  /** Sequential per operator, gap-free */
  invoiceNumber: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string | null;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string | null;
  /** ISO-8601 timestamp (UTC) */
  issueDate: string;
  /** ISO-8601 timestamp (UTC) */
  dueDate: string | null;
  currency: string;
  subtotal: Money;
  tax: Money;
  total: Money;
  amountPaid: Money;
  status: "draft" | "open" | "partial" | "paid" | "overdue" | "void";
  overdue: boolean;
  notes: string | null;
  replacesInvoiceId?: string | null;
  /** ISO-8601 timestamp (UTC) */
  sentAt?: string | null;
  sendCount?: number;
  /** On list rows */
  customerLabel?: string | null;
  /** Invoice lines in print order */
  lines: Array<{
    [key: string]: unknown;
  }>;
  payments: Array<SwitchPayment>;
  customer: {
    id: string;
    label: string;
    source: string | null;
    currency: string;
  } | null;
  /** Voice usage on this invoice by destination country (derived, read-only) */
  countryBreakdown: {
    [key: string]: unknown;
  };
  /** The billing identity frozen onto the document at issue */
  billingProfile: {
    [key: string]: unknown;
  } | null;
  identityFrozen: boolean;
  /** Usage consciously left unbilled on this run, with the reason */
  exclusions: Array<{
    [key: string]: unknown;
  }>;
  replaces: {
    id: string;
    invoiceNumber: string;
    status: "draft" | "open" | "partial" | "paid" | "overdue" | "void";
  } | null;
  replacedBy: {
    id: string;
    invoiceNumber: string;
    status: "draft" | "open" | "partial" | "paid" | "overdue" | "void";
  } | null;
  [key: string]: unknown;
}

export interface SwitchInvoicePreview {
  customer: {
    id: string;
    label: string;
    legalName: string;
    currency: string;
  };
  period: {
    start: string;
    end: string;
    timezone: string;
    label: string;
  };
  dueDate: string;
  paymentTermsDays: number;
  currency: string;
  /** Billable, rated-at-zero, by-trunk and by-channel usage */
  usage: {
    [key: string]: unknown;
  };
  broughtForward: {
    [key: string]: unknown;
  };
  /** Usage that could not be priced. Blocks issue unless excluded with a reason. */
  unrated: {
    [key: string]: unknown;
  };
  lines: Array<{
    [key: string]: unknown;
  }>;
  /** US dollars as a JSON number rounded to 6 decimals (a computed figure, not a ledger string) */
  charges: number;
  credits: {
    [key: string]: unknown;
  };
  tax: {
    [key: string]: unknown;
  };
  /** US dollars as a JSON number rounded to 6 decimals (a computed figure, not a ledger string) */
  total: number;
  provenance: {
    [key: string]: unknown;
  };
  /** Pass to POST /switch/invoices to issue exactly what was reviewed */
  reviewToken?: string;
  [key: string]: unknown;
}

export interface SwitchCreditNote {
  id: string;
  customerId: string;
  creditNoteNumber: string;
  invoiceId: string | null;
  amount: Money;
  reason: string | null;
  /** issued (open credit) or applied */
  status: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  customerLabel?: string | null;
  [key: string]: unknown;
}

export interface SwitchPayable {
  id: string;
  vendorTrunkId: string;
  payableNumber: string;
  /** ISO-8601 timestamp (UTC) */
  periodStart: string | null;
  /** ISO-8601 timestamp (UTC) */
  periodEnd: string | null;
  /** ISO-8601 timestamp (UTC) */
  issueDate: string;
  /** ISO-8601 timestamp (UTC) */
  dueDate: string | null;
  currency: string;
  subtotal: Money;
  total: Money;
  amountPaid: Money;
  status: "draft" | "open" | "partial" | "paid" | "overdue" | "void";
  notes: string | null;
  overdue?: boolean;
  /** On list rows */
  trunkLabel?: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchCdr {
  id: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  kind: "voice" | "sms";
  direction: string;
  from: string | null;
  to: string | null;
  cli: string | null;
  status: string;
  sipCode: number | null;
  hangupCause: string | null;
  durationSeconds: number | null;
  billedSeconds: number | null;
  segments: number | null;
  pddMs: number | null;
  /** Shared by every failover attempt of one call */
  callGroupId: string | null;
  customer: string | null;
  supplier: string | null;
  /** US dollars as a JSON number rounded to 6 decimals (a computed figure, not a ledger string) */
  revenue: number;
  /** US dollars as a JSON number rounded to 6 decimals (a computed figure, not a ledger string) */
  cost: number;
  /** US dollars as a JSON number rounded to 6 decimals (a computed figure, not a ledger string) */
  margin: number;
  /** null when the call could not be rated (distinct from a real 0) */
  sellRatePerUnit: number | null;
  /** US dollars as a JSON number rounded to 6 decimals (a computed figure, not a ledger string) */
  buyRatePerUnit: number | null;
  ratingState: string | null;
  mos: number | null;
  jitterMs: number | null;
  packetLossPct: number | null;
  mediaMode: string | null;
  codec: string | null;
  q850Cause: number | null;
  destinationName: string | null;
  riskScore?: number | null;
  attestation?: string | null;
  customerTrunkId?: string | null;
  attemptCount?: number;
  invoiceId?: string | null;
  [key: string]: unknown;
}

export interface SwitchCdrExport {
  id: string;
  /** queued, running, completed or failed */
  phase: string;
  status: string;
  requestedScope: string | null;
  requestedAt: string;
  /** Only set once completed */
  recordCount: number | null;
  numbersMasked: boolean;
  addressesMasked: boolean;
  truncated?: boolean;
  error?: string | null;
  /** ISO-8601 timestamp (UTC) */
  completedAt?: string | null;
  downloadable?: boolean;
  /** GET /billing/exports/{id}/download once completed. No server path is ever returned. */
  downloadUrl?: string | null;
  rowCount?: number | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt?: string;
  queryId?: string | null;
  [key: string]: unknown;
}

export interface SwitchCdrView {
  id: string;
  name: string;
  service: "voice" | "sms";
  filters: {
    [key: string]: unknown;
  };
  columns: Array<string>;
  sort: Array<{
    field: string;
    direction: "asc" | "desc";
  }>;
  isDefault: boolean;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchFraudSettings {
  fraudEnabled: boolean;
  /** Risk score at or above which a call is refused */
  fraudBlockScore: number;
  /** Risk score at or above which a call is flagged */
  fraudAlertScore: number;
  highRiskPrefixes: Array<string>;
}

export interface SwitchIssue {
  key: string;
  /** Quotable reference, e.g. OPS-3F9A1C22 */
  ref: string;
  detector: string;
  severity: "critical" | "warning" | "review";
  actionable: boolean;
  status: "open_unacknowledged" | "open_acknowledged" | "resolved";
  title: string;
  summary: string;
  reason: string;
  trigger: string;
  recovery: string;
  objectName: string | null;
  /** The customer, trunks, supplier and destination the issue is about */
  subjects: {
    [key: string]: unknown;
  };
  evidence: Array<{
    label: string;
    value: string;
  }>;
  firstDetectedAt: string;
  lastDetectedAt: string;
  detections: number;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  resolvedVia: ("operator" | "recovery" | "dismissed") | null;
  /** What would reopen the issue if it were dismissed */
  dismissRule: string | null;
  [key: string]: unknown;
}

export interface SwitchTeamMember {
  id: string;
  userId: string;
  email: string;
  contactName: string | null;
  role: string;
  roleLabel: string;
  status: ("active" | "suspended") | string;
  customerIds: Array<string> | null;
  trunkIds: Array<string> | null;
  note: string | null;
  permissions: Array<string>;
  scopeSummary: {
    customers: string;
    trunks: string;
  };
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  [key: string]: unknown;
}

export interface SwitchApproval {
  id: string;
  /** pending, approved, rejected, expired... */
  status: string;
  permission?: string;
  /** ISO-8601 timestamp (UTC) */
  requestedAt: string;
  [key: string]: unknown;
}

export interface SwitchDncHonorSetting {
  scope: "customer" | "trunk";
  id: string;
  label: string;
  /** The setting itself; null on a trunk means it inherits from its customer */
  value: boolean | null;
  inherited: boolean | null;
  customerLabel: string | null;
  /** Whether calls are actually checked against Do Not Call */
  effective: boolean;
  /** Which level decided `effective` */
  decidedBy: "customer" | "trunk";
  /** The platform setting for Switch calls: off = not checked; warn = matches are recorded but the call proceeds; enforce = matches are refused */
  mode: "off" | "warn" | "enforce";
  /** Customer only: trunks that set their own value instead of inheriting */
  trunkOverrides?: {
    on: number;
    off: number;
  };
}

export interface PricingDestination {
  /** URL slug from the country name, e.g. "pakistan" */
  slug: string;
  country: string;
  /** E.164 country calling code, digits only */
  countryCode: string;
  /** Live routes that price at least one number type */
  routes: number;
  /** Lowest mobile, fixed or country-wide rate */
  lowest: string;
  /** `mobile` and `fixed`: rate-sheet rows named for that number type. `countryWide`: the bare country row (or a single-price listing), which prices every number without a more specific row. */
  lowestBand: "mobile" | "fixed" | "countryWide";
  /** Per minute (voice) or per message (SMS) */
  unit: "min" | "msg";
}

export interface PricingDestinationDetail {
  /** URL slug from the country name, e.g. "pakistan" */
  slug: string;
  country: string;
  /** E.164 country calling code, digits only */
  countryCode: string;
  /** Live routes that price at least one number type */
  routes: number;
  /** Lowest mobile, fixed or country-wide rate */
  lowest: string;
  /** `mobile` and `fixed`: rate-sheet rows named for that number type. `countryWide`: the bare country row (or a single-price listing), which prices every number without a more specific row. */
  lowestBand: "mobile" | "fixed" | "countryWide";
  /** Per minute (voice) or per message (SMS) */
  unit: "min" | "msg";
  type: "voice" | "sms";
  /** Highest route "from" price in the destination */
  highest: string;
  /** Lowest rate per number type */
  bands: Array<{
    /** `mobile` and `fixed`: rate-sheet rows named for that number type. `countryWide`: the bare country row (or a single-price listing), which prices every number without a more specific row. */
    key: "mobile" | "fixed" | "countryWide";
    /** USD, 6-decimal string, e.g. "0.020370" */
    from: string;
    routes: number;
  }>;
  /** Mobile operators broken out on at least two routes, cheapest first, at most 12 */
  operators: Array<{
    name: string;
    /** USD, 6-decimal string, e.g. "0.020370" */
    from: string;
    routes: number;
  }>;
  /** Caller-ID handling the sellers state (voice only) */
  cliTypes: Array<{
    cliType: string;
    routes: number;
  }>;
  /** Billing increments, e.g. "1/1" (voice only) */
  increments: Array<{
    increment: string;
    routes: number;
  }>;
  /** Routes whose seller states an ASR */
  routesWithStatedAsr: number;
  /** Named breakouts that are not a headline number type (toll-free, premium, cities) */
  otherBreakouts: number;
  /** The five cheapest routes, as anonymous facts */
  topRoutes: Array<{
    rank: number;
    /** USD, 6-decimal string, e.g. "0.020370" */
    from: string;
    /** USD, 6-decimal string, e.g. "0.020370" */
    mobileFrom: string | null;
    cliType: string;
    billingIncrement: string | null;
    /** Quality tier the route is listed under */
    routeType: string;
    /** Seller-stated ASR %, not measured */
    statedAsr: string | null;
    /** Seller-stated ACD in seconds, not measured */
    statedAcd: string | null;
  }>;
  /** Destinations in the same world numbering zone */
  related: Array<PricingDestination>;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface SystemHealth {
  components: Array<{
    name: string;
    status: "operational" | "degraded" | "down";
  }>;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface KycStatus {
  kycStatus: "not_started" | "pending" | "verified" | "rejected";
  accountType: ("individual" | "business") | null;
  kycExempt: boolean;
  depositGate: boolean;
  configured: boolean;
}

export interface UsComplianceProfile {
  userId: string;
  legalBusinessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  /** FCC Registration Number */
  frn: string;
  /** FCC Form 499 Filer ID */
  filer499Id: string;
  /** Operating Company Number */
  ocn: string;
  /** Listed in the FCC Robocall Mitigation Database */
  rmdRegistered: boolean;
  rmdReference: string | null;
  /** Signs its own STIR/SHAKEN attestations */
  signsOwnTraffic: boolean;
  stirShakenCert: string | null;
  attestationLevel: ("A" | "B" | "C") | null;
  /** ISO-8601 timestamp (UTC) */
  termsAcceptedAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  submittedAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  /** Machine-readable kind, e.g. webhook_failing, connection */
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: {
    [key: string]: unknown;
  } | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  /** Ticket category, e.g. billing_dispute, technical_support, other */
  category: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  relatedRouteId: string | null;
  relatedPurchaseId: string | null;
  assignedTo: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  resolvedAt: string | null;
}

export interface SupportTicketMessage {
  id: string;
  authorId: string | null;
  message: string;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  authorName?: string | null;
}

export interface StatusIncident {
  id: string;
  title: string;
  impact: "none" | "minor" | "major" | "critical";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  componentIds: Array<string>;
  /** ISO-8601 timestamp (UTC) */
  startedAt: string;
  /** ISO-8601 timestamp (UTC) */
  resolvedAt: string | null;
  updates: Array<{
    id: string;
    status: "investigating" | "identified" | "monitoring" | "resolved";
    body: string;
    /** ISO-8601 timestamp (UTC) */
    createdAt: string;
  }>;
}

export interface StatusPage {
  /** ISO-8601 timestamp (UTC) */
  generatedAt: string;
  overall: {
    state: "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";
    message: string;
  };
  groups: Array<{
    id: string;
    name: string;
    components: Array<{
      id: string;
      name: string;
      description: string;
      state: "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";
      /** Percent over 90 days; null when there is no data */
      uptime90d: number | null;
      dataSince: string | null;
      days: Array<{
        /** YYYY-MM-DD */
        date: string;
        state: ("operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance") | "no_data";
        uptimePct: number | null;
        downtimeMinutes: number | null;
        incidents: Array<{
          id: string;
          title: string;
          impact: "none" | "minor" | "major" | "critical";
        }>;
      }>;
    }>;
  }>;
  activeIncidents: Array<StatusIncident>;
  scheduledMaintenance: Array<{
    id: string;
    title: string;
    body: string;
    componentIds: Array<string>;
    /** ISO-8601 timestamp (UTC) */
    scheduledStart: string;
    /** ISO-8601 timestamp (UTC) */
    scheduledEnd: string;
    status: "scheduled" | "in_progress" | "completed";
  }>;
  pastIncidents: Array<StatusIncident>;
}

export interface WhitelistedIp {
  id: string;
  userId: string;
  /** IPv4/IPv6 address, optionally with a CIDR suffix */
  ipAddress: string;
  label: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface Interconnection {
  id: string;
  purchaseId: string;
  type: "sip" | "smpp" | "api";
  /** Your own connection settings and credentials */
  buyerEndpoint: {
    [key: string]: unknown;
  } | null;
  /** Always null: the seller endpoint is never shown to buyers */
  sellerEndpoint: "null" | null;
  status: "active" | "inactive";
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface ConnectionProfile {
  id: string;
  contactName: string | null;
  companyName: string | null;
  jobTitle?: string | null;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  country: string | null;
  verified: boolean;
  /** ISO-8601 timestamp (UTC) */
  memberSince?: string;
}

export interface SubAccount {
  id: string;
  label: string;
  externalRef: string | null;
  balance: Money;
  status: "draft" | "active" | "suspended" | "closed";
  /** Markup percent as a 3-decimal string; null = operator default */
  markupPct: string | null;
  /** null = operator default; "0.00" = unlimited */
  dailySpendCap: string | null;
  maxConcurrentCalls: number | null;
  /** Postpaid credit, "0.00" = strict prepaid */
  creditLimit: string;
  /** Display currency for statements */
  currency: string;
  portalEmail: string | null;
  /** Suspended automatically by a daily cap, lifts itself */
  autoSuspended: boolean;
  sipUsername: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
}

export interface SubAccountCreated {
  id: string;
  label: string;
  externalRef: string | null;
  balance: Money;
  status: "draft" | "active" | "suspended" | "closed";
  /** Markup percent as a 3-decimal string; null = operator default */
  markupPct: string | null;
  /** null = operator default; "0.00" = unlimited */
  dailySpendCap: string | null;
  maxConcurrentCalls: number | null;
  /** Postpaid credit, "0.00" = strict prepaid */
  creditLimit: string;
  /** Display currency for statements */
  currency: string;
  portalEmail: string | null;
  /** Suspended automatically by a daily cap, lifts itself */
  autoSuspended: boolean;
  sipUsername: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  updatedAt: string;
  /** The sub-account API key. Returned ONCE. */
  apiKey: string;
  apiKeyPrefix: string;
  /** The SIP password. Returned ONCE. */
  sipPassword: string;
}

export interface ApplicationSettings {
  operatorId: string;
  defaultMarkupPct: string;
  defaultBillingIncrement: string;
  minMarginPct: string;
  /** "0.00" disables low-balance alerts */
  subLowBalanceThreshold: string;
  /** US dollars as a decimal string with 2 decimal places, e.g. "50.00" */
  defaultDailySpendCap: string | null;
  defaultMaxConcurrentCalls: number | null;
  brandName: string | null;
  brandColor: string | null;
  brandLogoUrl: string | null;
  requireTrunkApproval: boolean;
  requireTrunkReadiness: boolean;
  [key: string]: unknown;
}

export interface RevshareNumber {
  id: string;
  number: string;
  country: string | null;
  countryCode: string | null;
  carrier: string | null;
  rangeLabel: string | null;
  groupKey: string;
  status: "available" | "taken" | "retired";
  /** What you earn per minute at the best payment term */
  ratePerMin: Money;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface RevshareTaking {
  id: string;
  numberId: string;
  userId: string;
  /** Payout cadence: 1_1 any day, 7_1 weekly, 15_15 twice monthly */
  paymentTerm: "1_1" | "7_1" | "15_15";
  /** What you earn per minute on this number */
  effectiveRate: Money;
  ivrConfigId: string | null;
  ivrMode: "single" | "split" | "geo";
  status: "active" | "released";
  callsCount: number;
  minutesTotal: string;
  earningsTotal: Money;
  /** ISO-8601 timestamp (UTC) */
  lastCallAt: string | null;
  /** ISO-8601 timestamp (UTC) */
  takenAt: string;
  /** ISO-8601 timestamp (UTC) */
  releasedAt: string | null;
}

export interface RevsharePayout {
  id: string;
  amount: Money;
  cryptoAsset: string | null;
  network: string | null;
  address: string | null;
  /** Payout cadence: 1_1 any day, 7_1 weekly, 15_15 twice monthly */
  term: "1_1" | "7_1" | "15_15";
  status: "requested" | "approved" | "paid" | "rejected";
  txRef: string | null;
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
  /** ISO-8601 timestamp (UTC) */
  paidAt: string | null;
}

export interface RevshareIvrConfig {
  id: string;
  userId: string;
  takingId: string | null;
  kind: "default_music" | "upload" | "tts";
  name: string | null;
  assetPath: string | null;
  /** Set when audio exists; stream it from the preview endpoint */
  assetMime: string | null;
  ttsText: string | null;
  ttsVoiceId: string | null;
  status: "draft" | "active";
  /** ISO-8601 timestamp (UTC) */
  createdAt: string;
}

export interface RevshareIvrSet {
  mode: "single" | "split" | "geo";
  variants: Array<{
    id: string;
    ivrConfigId: string;
    name: string;
    kind: ("default_music" | "upload" | "tts") | null;
    weightPct: number | null;
    originIso: string | null;
    originCountry: string | null;
    enabled: boolean | null;
  }>;
}

/** Every operation in the spec, keyed by operationId. Paths include the /api/v1 prefix. */
export interface Operations {
  /** Revoke an API key */
  deleteAccountApiKeysById: { method: "DELETE"; path: "/api/v1/account/api-keys/{id}"; tag: "API keys" };
  /** Remove a route from your favorites */
  deleteAccountFavoritesByRouteId: { method: "DELETE"; path: "/api/v1/account/favorites/{routeId}"; tag: "Account" };
  /** Delete a saved search */
  deleteAccountSavedSearchesById: { method: "DELETE"; path: "/api/v1/account/saved-searches/{id}"; tag: "Account" };
  /** Delete a webhook endpoint */
  deleteAccountWebhooksById: { method: "DELETE"; path: "/api/v1/account/webhooks/{id}"; tag: "Webhooks" };
  /** Delete an AI voice agent */
  deleteAiAgentsById: { method: "DELETE"; path: "/api/v1/ai-agents/{id}"; tag: "AI voice agents" };
  /** Revoke a sub-account API key */
  deleteApplicationSubAccountsByIdApiKeysByKeyId: { method: "DELETE"; path: "/api/v1/application/sub-accounts/{id}/api-keys/{keyId}"; tag: "Application Manager" };
  /** Sign out one session */
  deleteAuthSessionsById: { method: "DELETE"; path: "/api/v1/auth/sessions/{id}"; tag: "Authentication" };
  /** Remove a connection */
  deleteConnectionsById: { method: "DELETE"; path: "/api/v1/connections/{id}"; tag: "Connections" };
  /** Delete a caller-ID set */
  deleteDialerCallerIdsById: { method: "DELETE"; path: "/api/v1/dialer/caller-ids/{id}"; tag: "Dialer" };
  /** Remove one caller ID from a set */
  deleteDialerCallerIdsByIdNumbersByNid: { method: "DELETE"; path: "/api/v1/dialer/caller-ids/{id}/numbers/{nid}"; tag: "Dialer" };
  /** Delete a campaign */
  deleteDialerCampaignsById: { method: "DELETE"; path: "/api/v1/dialer/campaigns/{id}"; tag: "Dialer" };
  /** Remove every caller ID from a campaign */
  deleteDialerCampaignsByIdClis: { method: "DELETE"; path: "/api/v1/dialer/campaigns/{id}/clis"; tag: "Dialer" };
  /** Remove every number from a campaign */
  deleteDialerCampaignsByIdNumbers: { method: "DELETE"; path: "/api/v1/dialer/campaigns/{id}/numbers"; tag: "Dialer" };
  /** Remove one number from a campaign */
  deleteDialerCampaignsByIdNumbersByNumberId: { method: "DELETE"; path: "/api/v1/dialer/campaigns/{id}/numbers/{numberId}"; tag: "Dialer" };
  /** Delete a simple caller-ID list */
  deleteDialerCliSetsById: { method: "DELETE"; path: "/api/v1/dialer/cli-sets/{id}"; tag: "Dialer" };
  /** Delete a saved contact list */
  deleteDialerContactListsById: { method: "DELETE"; path: "/api/v1/dialer/contact-lists/{id}"; tag: "Dialer" };
  /** Delete an SMS template */
  deleteDialerTemplatesById: { method: "DELETE"; path: "/api/v1/dialer/templates/{id}"; tag: "Dialer" };
  /** Delete a greeting */
  deleteDidsByIdGreetingsByAssetId: { method: "DELETE"; path: "/api/v1/dids/{id}/greetings/{assetId}"; tag: "Phone numbers" };
  /** Delete a call recording */
  deleteDidsByIdRecordingsByRecId: { method: "DELETE"; path: "/api/v1/dids/{id}/recordings/{recId}"; tag: "Phone numbers" };
  /** Delete a softphone line */
  deleteDidsByIdSipLinesByLineId: { method: "DELETE"; path: "/api/v1/dids/{id}/sip-lines/{lineId}"; tag: "Phone numbers" };
  /** Delete a voicemail */
  deleteDidsByIdVoicemailsByRecId: { method: "DELETE"; path: "/api/v1/dids/{id}/voicemails/{recId}"; tag: "Phone numbers" };
  /** Remove a number from your do-not-call list */
  deleteDncById: { method: "DELETE"; path: "/api/v1/dnc/{id}"; tag: "Do not call" };
  /** Remove a whitelisted source IP */
  deleteInterconnectionsIpsById: { method: "DELETE"; path: "/api/v1/interconnections/ips/{id}"; tag: "Interconnections" };
  /** Cancel a purchase */
  deletePurchasesById: { method: "DELETE"; path: "/api/v1/purchases/{id}"; tag: "Purchases" };
  /** Clear a purchase's routing position */
  deletePurchasesByIdRoutingPriority: { method: "DELETE"; path: "/api/v1/purchases/{id}/routing-priority"; tag: "Purchases" };
  /** Delete an IVR configuration */
  deleteRevshareIvrConfigsById: { method: "DELETE"; path: "/api/v1/revshare/ivr-configs/{id}"; tag: "Revenue share numbers" };
  /** Revoke an access grant */
  deleteRouteAccessById: { method: "DELETE"; path: "/api/v1/route-access/{id}"; tag: "Route access" };
  /** Archive a blended route */
  deleteRoutesBlendsById: { method: "DELETE"; path: "/api/v1/routes/blends/{id}"; tag: "Route blends" };
  /** Delete a route you listed */
  deleteRoutesById: { method: "DELETE"; path: "/api/v1/routes/{id}"; tag: "Marketplace routes" };
  /** Delete one rate from your deck */
  deleteRoutesByIdRatesByRateId: { method: "DELETE"; path: "/api/v1/routes/{id}/rates/{rateId}"; tag: "Rate sheets" };
  /** Delete a listing preset */
  deleteRoutesListingPresetsByName: { method: "DELETE"; path: "/api/v1/routes/listing-presets/{name}"; tag: "Marketplace routes" };
  /** Remove a saved SIP endpoint */
  deleteRoutesMyEndpointsById: { method: "DELETE"; path: "/api/v1/routes/my-endpoints/{id}"; tag: "Marketplace routes" };
  /** Remove an inbound IP ACL entry */
  deleteSwitchAclsById: { method: "DELETE"; path: "/api/v1/switch/acls/{id}"; tag: "Switch: routing" };
  /** Delete a saved call-record view */
  deleteSwitchCdrViewsByViewId: { method: "DELETE"; path: "/api/v1/switch/cdr-views/{viewId}"; tag: "Switch: CDRs and analytics" };
  /** Delete a bilateral counterparty */
  deleteSwitchCounterpartiesById: { method: "DELETE"; path: "/api/v1/switch/counterparties/{id}"; tag: "Switch: invoicing" };
  /** Delete a draft Switch customer */
  deleteSwitchCustomersById: { method: "DELETE"; path: "/api/v1/switch/customers/{id}"; tag: "Switch: customers" };
  /** Delete a Switch customer contact */
  deleteSwitchCustomersByIdContactsByContactId: { method: "DELETE"; path: "/api/v1/switch/customers/{id}/contacts/{contactId}"; tag: "Switch: customers" };
  /** Delete a Switch customer note */
  deleteSwitchCustomersByIdNotesByNoteId: { method: "DELETE"; path: "/api/v1/switch/customers/{id}/notes/{noteId}"; tag: "Switch: customers" };
  /** Discontinue one Switch customer sell rate now */
  deleteSwitchCustomersByIdSellRatesByRateId: { method: "DELETE"; path: "/api/v1/switch/customers/{id}/sell-rates/{rateId}"; tag: "Switch: customers" };
  /** Cancel a scheduled Switch customer sell rate */
  deleteSwitchCustomersByIdSellRatesScheduledByRateId: { method: "DELETE"; path: "/api/v1/switch/customers/{id}/sell-rates/scheduled/{rateId}"; tag: "Switch: customers" };
  /** Delete an unused Switch customer trunk */
  deleteSwitchCustomerTrunksByTrunkId: { method: "DELETE"; path: "/api/v1/switch/customer-trunks/{trunkId}"; tag: "Switch: customer trunks" };
  /** Remove an allowed source address from a trunk */
  deleteSwitchCustomerTrunksByTrunkIdIpsByAclId: { method: "DELETE"; path: "/api/v1/switch/customer-trunks/{trunkId}/ips/{aclId}"; tag: "Switch: customer trunks" };
  /** Discontinue one sell rate on a trunk now */
  deleteSwitchCustomerTrunksByTrunkIdRatesByRateId: { method: "DELETE"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/{rateId}"; tag: "Switch: customer trunks" };
  /** Cancel a scheduled sell rate on a trunk */
  deleteSwitchCustomerTrunksByTrunkIdRatesScheduledByRateId: { method: "DELETE"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/scheduled/{rateId}"; tag: "Switch: customer trunks" };
  /** Delete a dialplan */
  deleteSwitchDialplansById: { method: "DELETE"; path: "/api/v1/switch/dialplans/{id}"; tag: "Switch: routing" };
  /** Delete a provider */
  deleteSwitchProvidersById: { method: "DELETE"; path: "/api/v1/switch/providers/{id}"; tag: "Switch: suppliers" };
  /** Delete a provider contact */
  deleteSwitchProvidersByIdContactsByContactId: { method: "DELETE"; path: "/api/v1/switch/providers/{id}/contacts/{contactId}"; tag: "Switch: suppliers" };
  /** Delete a rate deck */
  deleteSwitchRateDecksById: { method: "DELETE"; path: "/api/v1/switch/rate-decks/{id}"; tag: "Switch: rating" };
  /** Delete a route group */
  deleteSwitchRoutePlansById: { method: "DELETE"; path: "/api/v1/switch/route-plans/{id}"; tag: "Switch: routing" };
  /** Delete a saved route trace */
  deleteSwitchRoutingTracesById: { method: "DELETE"; path: "/api/v1/switch/routing/traces/{id}"; tag: "Switch: routing" };
  /** Delete an operator sell rate */
  deleteSwitchSellRatesById: { method: "DELETE"; path: "/api/v1/switch/sell-rates/{id}"; tag: "Switch: rating" };
  /** Delete a provider */
  deleteSwitchSupplierAccountsById: { method: "DELETE"; path: "/api/v1/switch/supplier-accounts/{id}"; tag: "Switch: suppliers" };
  /** Delete a provider contact */
  deleteSwitchSupplierAccountsByIdContactsByContactId: { method: "DELETE"; path: "/api/v1/switch/supplier-accounts/{id}/contacts/{contactId}"; tag: "Switch: suppliers" };
  /** Delete a supplier trunk */
  deleteSwitchSuppliersById: { method: "DELETE"; path: "/api/v1/switch/suppliers/{id}"; tag: "Switch: suppliers" };
  /** Remove a SIP endpoint */
  deleteSwitchSuppliersByIdEndpointsByEndpointId: { method: "DELETE"; path: "/api/v1/switch/suppliers/{id}/endpoints/{endpointId}"; tag: "Switch: suppliers" };
  /** Delete one cost row from a supplier trunk */
  deleteSwitchSuppliersByIdRatesByRateId: { method: "DELETE"; path: "/api/v1/switch/suppliers/{id}/rates/{rateId}"; tag: "Switch: suppliers" };
  /** Cancel a scheduled cost change */
  deleteSwitchSuppliersByIdRatesScheduledByRateId: { method: "DELETE"; path: "/api/v1/switch/suppliers/{id}/rates/scheduled/{rateId}"; tag: "Switch: suppliers" };
  /** Suspend a team member */
  deleteSwitchTeamByMemberId: { method: "DELETE"; path: "/api/v1/switch/team/{memberId}"; tag: "Switch: team and audit" };
  /** Remove a saved card */
  deleteTopupsPaymentMethodsById: { method: "DELETE"; path: "/api/v1/topups/payment-methods/{id}"; tag: "Top-ups" };
  /** Get your account profile */
  getAccount: { method: "GET"; path: "/api/v1/account"; tag: "Account" };
  /** List recent security activity */
  getAccountActivity: { method: "GET"; path: "/api/v1/account/activity"; tag: "Account" };
  /** Get your spend alert settings */
  getAccountAlerts: { method: "GET"; path: "/api/v1/account/alerts"; tag: "Account" };
  /** List your API keys */
  getAccountApiKeys: { method: "GET"; path: "/api/v1/account/api-keys"; tag: "API keys" };
  /** Get API usage for your account or one key */
  getAccountApiUsage: { method: "GET"; path: "/api/v1/account/api-usage"; tag: "API usage" };
  /** Get your balance and test credit */
  getAccountBalance: { method: "GET"; path: "/api/v1/account/balance"; tag: "Account" };
  /** Preview what closing the account would take */
  getAccountClosePreview: { method: "GET"; path: "/api/v1/account/close/preview"; tag: "Account" };
  /** Export all your account data */
  getAccountExport: { method: "GET"; path: "/api/v1/account/export"; tag: "Account" };
  /** List your favorite routes */
  getAccountFavorites: { method: "GET"; path: "/api/v1/account/favorites"; tag: "Account" };
  /** Get which walkthrough steps the account has completed */
  getAccountGuideProgress: { method: "GET"; path: "/api/v1/account/guide-progress"; tag: "Account" };
  /** Get one headline figure per workspace */
  getAccountHubStats: { method: "GET"; path: "/api/v1/account/hub-stats"; tag: "Account" };
  /** List your dedicated IP addresses */
  getAccountIps: { method: "GET"; path: "/api/v1/account/ips"; tag: "Account" };
  /** Get your connectivity brief */
  getAccountIpsConnectivity: { method: "GET"; path: "/api/v1/account/ips/connectivity"; tag: "Account" };
  /** Get your SIP interconnect details */
  getAccountIpsInterconnect: { method: "GET"; path: "/api/v1/account/ips/interconnect"; tag: "Account" };
  /** List your saved marketplace searches */
  getAccountSavedSearches: { method: "GET"; path: "/api/v1/account/saved-searches"; tag: "Account" };
  /** Get your Switch plan and trial status */
  getAccountSwitchSubscription: { method: "GET"; path: "/api/v1/account/switch-subscription"; tag: "Account" };
  /** Get your Switch free-trial application */
  getAccountSwitchTrialApplication: { method: "GET"; path: "/api/v1/account/switch-trial-application"; tag: "Account" };
  /** List your webhook endpoints */
  getAccountWebhooks: { method: "GET"; path: "/api/v1/account/webhooks"; tag: "Webhooks" };
  /** List deliveries for one webhook endpoint */
  getAccountWebhooksByIdDeliveries: { method: "GET"; path: "/api/v1/account/webhooks/{id}/deliveries"; tag: "Webhooks" };
  /** List webhook deliveries across all your endpoints */
  getAccountWebhooksDeliveries: { method: "GET"; path: "/api/v1/account/webhooks/deliveries"; tag: "Webhooks" };
  /** Get one webhook delivery, with its payload */
  getAccountWebhooksDeliveriesByDeliveryId: { method: "GET"; path: "/api/v1/account/webhooks/deliveries/{deliveryId}"; tag: "Webhooks" };
  /** List your AI voice agents */
  getAiAgents: { method: "GET"; path: "/api/v1/ai-agents"; tag: "AI voice agents" };
  /** Get an AI voice agent */
  getAiAgentsById: { method: "GET"; path: "/api/v1/ai-agents/{id}"; tag: "AI voice agents" };
  /** List the voices an agent can speak with */
  getAiAgentsVoices: { method: "GET"; path: "/api/v1/ai-agents/voices"; tag: "AI voice agents" };
  /** Get reseller analytics across your sub-accounts */
  getApplicationAnalytics: { method: "GET"; path: "/api/v1/application/analytics"; tag: "Application Manager" };
  /** Get sub-account totals */
  getApplicationOverview: { method: "GET"; path: "/api/v1/application/overview"; tag: "Application Manager" };
  /** Get your Application Manager settings */
  getApplicationSettings: { method: "GET"; path: "/api/v1/application/settings"; tag: "Application Manager" };
  /** List your sub-accounts */
  getApplicationSubAccounts: { method: "GET"; path: "/api/v1/application/sub-accounts"; tag: "Application Manager" };
  /** Get a sub-account */
  getApplicationSubAccountsById: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}"; tag: "Application Manager" };
  /** Get analytics for one sub-account */
  getApplicationSubAccountsByIdAnalytics: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}/analytics"; tag: "Application Manager" };
  /** List a sub-account's API keys */
  getApplicationSubAccountsByIdApiKeys: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}/api-keys"; tag: "Application Manager" };
  /** List call records for a sub-account */
  getApplicationSubAccountsByIdCdrs: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}/cdrs"; tag: "Application Manager" };
  /** Export a sub-account's call records as CSV */
  getApplicationSubAccountsByIdCdrsExport: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}/cdrs/export"; tag: "Application Manager" };
  /** Get a monthly statement for a sub-account */
  getApplicationSubAccountsByIdStatement: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}/statement"; tag: "Application Manager" };
  /** Get lifetime usage for a sub-account */
  getApplicationSubAccountsByIdUsage: { method: "GET"; path: "/api/v1/application/sub-accounts/{id}/usage"; tag: "Application Manager" };
  /** Finish a social login (provider callback) */
  getAuthOauthByProviderCallback: { method: "GET"; path: "/api/v1/auth/oauth/{provider}/callback"; tag: "Authentication" };
  /** Start a social login */
  getAuthOauthByProviderStart: { method: "GET"; path: "/api/v1/auth/oauth/{provider}/start"; tag: "Authentication" };
  /** List the social login providers that are enabled */
  getAuthOauthProviders: { method: "GET"; path: "/api/v1/auth/oauth/providers"; tag: "Authentication" };
  /** List your active sessions */
  getAuthSessions: { method: "GET"; path: "/api/v1/auth/sessions"; tag: "Authentication" };
  /** Get your end-of-day balance history */
  getBillingBalanceHistory: { method: "GET"; path: "/api/v1/billing/balance-history"; tag: "Billing" };
  /** List your call and message records */
  getBillingCdrs: { method: "GET"; path: "/api/v1/billing/cdrs"; tag: "Billing" };
  /** Stream your call records as CSV */
  getBillingCdrsExport: { method: "GET"; path: "/api/v1/billing/cdrs/export"; tag: "Billing" };
  /** Get seller earnings broken down by route */
  getBillingEarningsByRoute: { method: "GET"; path: "/api/v1/billing/earnings-by-route"; tag: "Billing" };
  /** List your call-record exports */
  getBillingExports: { method: "GET"; path: "/api/v1/billing/exports"; tag: "Billing" };
  /** Download a finished call-record export */
  getBillingExportsByIdDownload: { method: "GET"; path: "/api/v1/billing/exports/{id}/download"; tag: "Billing" };
  /** List posted, pending and unposted money movements */
  getBillingFinancialActivityActivity: { method: "GET"; path: "/api/v1/billing/financial-activity/activity"; tag: "Billing" };
  /** List live call authorisations on a wallet */
  getBillingFinancialActivityAuthorisations: { method: "GET"; path: "/api/v1/billing/financial-activity/authorisations"; tag: "Billing" };
  /** List sub-account wallets you operate with their positions */
  getBillingFinancialActivityCustomers: { method: "GET"; path: "/api/v1/billing/financial-activity/customers"; tag: "Billing" };
  /** Get the financial position of your wallet or a sub-account */
  getBillingFinancialActivityPosition: { method: "GET"; path: "/api/v1/billing/financial-activity/position"; tag: "Billing" };
  /** Reconcile a wallet balance against its ledger */
  getBillingFinancialActivityReconciliation: { method: "GET"; path: "/api/v1/billing/financial-activity/reconciliation"; tag: "Billing" };
  /** List your receipts and statements */
  getBillingInvoices: { method: "GET"; path: "/api/v1/billing/invoices"; tag: "Billing" };
  /** Get a receipt or statement */
  getBillingInvoicesById: { method: "GET"; path: "/api/v1/billing/invoices/{id}"; tag: "Billing" };
  /** Get your monthly statement */
  getBillingStatements: { method: "GET"; path: "/api/v1/billing/statements"; tag: "Billing" };
  /** Get your spending and earnings summary */
  getBillingSummary: { method: "GET"; path: "/api/v1/billing/summary"; tag: "Billing" };
  /** List your tax invoices */
  getBillingTaxInvoices: { method: "GET"; path: "/api/v1/billing/tax-invoices"; tag: "Billing" };
  /** Get a tax invoice */
  getBillingTaxInvoicesById: { method: "GET"; path: "/api/v1/billing/tax-invoices/{id}"; tag: "Billing" };
  /** Get daily voice and SMS spend */
  getBillingTrafficTimeseries: { method: "GET"; path: "/api/v1/billing/traffic-timeseries"; tag: "Billing" };
  /** List ledger transactions */
  getBillingTransactions: { method: "GET"; path: "/api/v1/billing/transactions"; tag: "Billing" };
  /** Get your outbound usage grouped by destination country */
  getBillingUsageByDestination: { method: "GET"; path: "/api/v1/billing/usage-by-destination"; tag: "Billing" };
  /** List your caller-ID tests */
  getCliTests: { method: "GET"; path: "/api/v1/cli-tests"; tag: "CLI tests" };
  /** List your route liveness tests */
  getCliTestsBatches: { method: "GET"; path: "/api/v1/cli-tests/batches"; tag: "CLI tests" };
  /** Get a route liveness test and each route's result */
  getCliTestsBatchesById: { method: "GET"; path: "/api/v1/cli-tests/batches/{id}"; tag: "CLI tests" };
  /** Get a caller-ID test and its result */
  getCliTestsById: { method: "GET"; path: "/api/v1/cli-tests/{id}"; tag: "CLI tests" };
  /** Check whether handset caller-ID testing is available */
  getCliTestsProviderStatus: { method: "GET"; path: "/api/v1/cli-tests/provider-status"; tag: "CLI tests" };
  /** Get your caller-ID test quota and price */
  getCliTestsQuota: { method: "GET"; path: "/api/v1/cli-tests/quota"; tag: "CLI tests" };
  /** List the countries with test handsets online */
  getCliTestsTestableDestinations: { method: "GET"; path: "/api/v1/cli-tests/testable-destinations"; tag: "CLI tests" };
  /** List your API call history */
  getCommsCalls: { method: "GET"; path: "/api/v1/comms/calls"; tag: "Voice and SMS" };
  /** Get one call: live status, cost and gathered digits */
  getCommsCallsById: { method: "GET"; path: "/api/v1/comms/calls/{id}"; tag: "Voice and SMS" };
  /** List your SMS history */
  getCommsSms: { method: "GET"; path: "/api/v1/comms/sms"; tag: "Voice and SMS" };
  /** Get the delivery status and timeline of a sent SMS */
  getCommsSmsByMessageId: { method: "GET"; path: "/api/v1/comms/sms/{messageId}"; tag: "Voice and SMS" };
  /** Get the outcome of a voice passcode call */
  getCommsVoiceOtpById: { method: "GET"; path: "/api/v1/comms/voice-otp/{id}"; tag: "Verify" };
  /** List your connections */
  getConnections: { method: "GET"; path: "/api/v1/connections"; tag: "Connections" };
  /** Get a connection with the routes each side can see */
  getConnectionsById: { method: "GET"; path: "/api/v1/connections/{id}"; tag: "Connections" };
  /** Get your connect code */
  getConnectionsCode: { method: "GET"; path: "/api/v1/connections/code"; tag: "Connections" };
  /** Look up the account behind a connect code */
  getConnectionsLookup: { method: "GET"; path: "/api/v1/connections/lookup"; tag: "Connections" };
  /** Get dialer analytics across all your campaigns */
  getDialerAnalyticsOverview: { method: "GET"; path: "/api/v1/dialer/analytics/overview"; tag: "Dialer" };
  /** List your caller-ID sets */
  getDialerCallerIds: { method: "GET"; path: "/api/v1/dialer/caller-ids"; tag: "Dialer" };
  /** Get a caller-ID set */
  getDialerCallerIdsById: { method: "GET"; path: "/api/v1/dialer/caller-ids/{id}"; tag: "Dialer" };
  /** List the caller IDs in a set, with usage stats */
  getDialerCallerIdsByIdNumbers: { method: "GET"; path: "/api/v1/dialer/caller-ids/{id}/numbers"; tag: "Dialer" };
  /** Get usage stats for a caller-ID set */
  getDialerCallerIdsByIdStats: { method: "GET"; path: "/api/v1/dialer/caller-ids/{id}/stats"; tag: "Dialer" };
  /** List your dialer and SMS campaigns */
  getDialerCampaigns: { method: "GET"; path: "/api/v1/dialer/campaigns"; tag: "Dialer" };
  /** Get a campaign */
  getDialerCampaignsById: { method: "GET"; path: "/api/v1/dialer/campaigns/{id}"; tag: "Dialer" };
  /** Get detailed analytics for one campaign */
  getDialerCampaignsByIdAnalytics: { method: "GET"; path: "/api/v1/dialer/campaigns/{id}/analytics"; tag: "Dialer" };
  /** List a campaign’s caller IDs */
  getDialerCampaignsByIdClis: { method: "GET"; path: "/api/v1/dialer/campaigns/{id}/clis"; tag: "Dialer" };
  /** List a campaign’s numbers with their call outcome */
  getDialerCampaignsByIdNumbers: { method: "GET"; path: "/api/v1/dialer/campaigns/{id}/numbers"; tag: "Dialer" };
  /** Get live progress and spend for a campaign */
  getDialerCampaignsByIdStats: { method: "GET"; path: "/api/v1/dialer/campaigns/{id}/stats"; tag: "Dialer" };
  /** List your simple caller-ID lists */
  getDialerCliSets: { method: "GET"; path: "/api/v1/dialer/cli-sets"; tag: "Dialer" };
  /** List your saved contact lists */
  getDialerContactLists: { method: "GET"; path: "/api/v1/dialer/contact-lists"; tag: "Dialer" };
  /** Get a saved contact list with its numbers */
  getDialerContactListsById: { method: "GET"; path: "/api/v1/dialer/contact-lists/{id}"; tag: "Dialer" };
  /** Match inbound callers to the caller IDs in a set */
  getDialerTargetListsCompatible: { method: "GET"; path: "/api/v1/dialer/target-lists/compatible"; tag: "Dialer" };
  /** List your SMS templates */
  getDialerTemplates: { method: "GET"; path: "/api/v1/dialer/templates"; tag: "Dialer" };
  /** Get a spend and usage overview across your numbers */
  getDidsAnalyticsOverview: { method: "GET"; path: "/api/v1/dids/analytics/overview"; tag: "Phone numbers" };
  /** Get one of your phone numbers */
  getDidsById: { method: "GET"; path: "/api/v1/dids/{id}"; tag: "Phone numbers" };
  /** See which AI voice agent answers a number */
  getDidsByIdAiAgent: { method: "GET"; path: "/api/v1/dids/{id}/ai-agent"; tag: "Phone numbers" };
  /** Get spend and usage analytics for a number */
  getDidsByIdAnalytics: { method: "GET"; path: "/api/v1/dids/{id}/analytics"; tag: "Phone numbers" };
  /** List inbound calls to a number */
  getDidsByIdCdrs: { method: "GET"; path: "/api/v1/dids/{id}/cdrs"; tag: "Phone numbers" };
  /** Get a number's voicemail, recording, IVR and schedule settings */
  getDidsByIdFeatures: { method: "GET"; path: "/api/v1/dids/{id}/features"; tag: "Phone numbers" };
  /** List a number's uploaded greetings */
  getDidsByIdGreetings: { method: "GET"; path: "/api/v1/dids/{id}/greetings"; tag: "Phone numbers" };
  /** Download a greeting's audio */
  getDidsByIdGreetingsByAssetIdAudio: { method: "GET"; path: "/api/v1/dids/{id}/greetings/{assetId}/audio"; tag: "Phone numbers" };
  /** List SMS messages on a number */
  getDidsByIdMessages: { method: "GET"; path: "/api/v1/dids/{id}/messages"; tag: "Phone numbers" };
  /** List SMS conversations on a number */
  getDidsByIdMessagesConversations: { method: "GET"; path: "/api/v1/dids/{id}/messages/conversations"; tag: "Phone numbers" };
  /** List call recordings on a number */
  getDidsByIdRecordings: { method: "GET"; path: "/api/v1/dids/{id}/recordings"; tag: "Phone numbers" };
  /** Download a call recording */
  getDidsByIdRecordingsByRecIdAudio: { method: "GET"; path: "/api/v1/dids/{id}/recordings/{recId}/audio"; tag: "Phone numbers" };
  /** Get a number's call flow */
  getDidsByIdRouting: { method: "GET"; path: "/api/v1/dids/{id}/routing"; tag: "Phone numbers" };
  /** List a number's softphone lines */
  getDidsByIdSipLines: { method: "GET"; path: "/api/v1/dids/{id}/sip-lines"; tag: "Phone numbers" };
  /** Get a number's SMS settings */
  getDidsByIdSmsSettings: { method: "GET"; path: "/api/v1/dids/{id}/sms-settings"; tag: "Phone numbers" };
  /** List voicemails on a number */
  getDidsByIdVoicemails: { method: "GET"; path: "/api/v1/dids/{id}/voicemails"; tag: "Phone numbers" };
  /** Download a voicemail */
  getDidsByIdVoicemailsByRecIdAudio: { method: "GET"; path: "/api/v1/dids/{id}/voicemails/{recId}/audio"; tag: "Phone numbers" };
  /** Browse the number catalogue */
  getDidsCatalog: { method: "GET"; path: "/api/v1/dids/catalog"; tag: "Phone numbers" };
  /** List countries with numbers for sale */
  getDidsCatalogCountries: { method: "GET"; path: "/api/v1/dids/catalog/countries"; tag: "Phone numbers" };
  /** List number types for sale */
  getDidsCatalogTypes: { method: "GET"; path: "/api/v1/dids/catalog/types"; tag: "Phone numbers" };
  /** List your numbers usable as outbound caller IDs */
  getDidsCliEligible: { method: "GET"; path: "/api/v1/dids/cli-eligible"; tag: "Phone numbers" };
  /** Get your request to list numbers on the marketplace */
  getDidsListingRequest: { method: "GET"; path: "/api/v1/dids/listing-request"; tag: "Phone numbers" };
  /** List your phone numbers */
  getDidsMine: { method: "GET"; path: "/api/v1/dids/mine"; tag: "Phone numbers" };
  /** Search the catalogue by digit pattern or vanity run */
  getDidsSearch: { method: "GET"; path: "/api/v1/dids/search"; tag: "Phone numbers" };
  /** List your do-not-call entries */
  getDnc: { method: "GET"; path: "/api/v1/dnc"; tag: "Do not call" };
  /** Download your do-not-call list as CSV */
  getDncExport: { method: "GET"; path: "/api/v1/dnc/export"; tag: "Do not call" };
  /** Get everything the first-call guide needs */
  getFirstCallState: { method: "GET"; path: "/api/v1/first-call/state"; tag: "Onboarding" };
  /** Check first-call progress */
  getFirstCallStatus: { method: "GET"; path: "/api/v1/first-call/status"; tag: "Onboarding" };
  /** Check that the API is up */
  getHealth: { method: "GET"; path: "/api/v1/health"; tag: "System" };
  /** Get component health for the platform */
  getHealthStatus: { method: "GET"; path: "/api/v1/health/status"; tag: "System" };
  /** List your interconnections */
  getInterconnections: { method: "GET"; path: "/api/v1/interconnections"; tag: "Interconnections" };
  /** Get an interconnection */
  getInterconnectionsById: { method: "GET"; path: "/api/v1/interconnections/{id}"; tag: "Interconnections" };
  /** Get live connection health per purchase */
  getInterconnectionsHealth: { method: "GET"; path: "/api/v1/interconnections/health"; tag: "Interconnections" };
  /** List your whitelisted source IPs */
  getInterconnectionsIps: { method: "GET"; path: "/api/v1/interconnections/ips"; tag: "Interconnections" };
  /** Get a summary of your interconnect setup */
  getInterconnectionsStatusSummary: { method: "GET"; path: "/api/v1/interconnections/status/summary"; tag: "Interconnections" };
  /** Get your identity verification status */
  getKycStatus: { method: "GET"; path: "/api/v1/kyc/status"; tag: "Compliance" };
  /** Look up a phone number */
  getLookupByNumber: { method: "GET"; path: "/api/v1/lookup/{number}"; tag: "Number lookup" };
  /** Get the marketplace summary */
  getMarketsSummary: { method: "GET"; path: "/api/v1/markets/summary"; tag: "Markets" };
  /** List your notifications */
  getNotifications: { method: "GET"; path: "/api/v1/notifications"; tag: "Notifications" };
  /** List offers you made and received */
  getOffers: { method: "GET"; path: "/api/v1/offers"; tag: "Offers" };
  /** Get an offer with its negotiation history */
  getOffersById: { method: "GET"; path: "/api/v1/offers/{id}"; tag: "Offers" };
  /** List your bulk offers */
  getOffersGroups: { method: "GET"; path: "/api/v1/offers/groups"; tag: "Offers" };
  /** List your payout requests */
  getPayouts: { method: "GET"; path: "/api/v1/payouts"; tag: "Payouts" };
  /** Get the public AI voice price per minute */
  getPricingAiVoice: { method: "GET"; path: "/api/v1/pricing/ai-voice"; tag: "System" };
  /** List destinations with live routes and their lowest rates */
  getPricingDestinations: { method: "GET"; path: "/api/v1/pricing/destinations"; tag: "Markets" };
  /** Get the live market for one destination */
  getPricingDestinationsBySlug: { method: "GET"; path: "/api/v1/pricing/destinations/{slug}"; tag: "Markets" };
  /** Look at a saved draft listing */
  getPublicListingsByToken: { method: "GET"; path: "/api/v1/public/listings/{token}"; tag: "Marketplace routes" };
  /** Browse the public number catalogue */
  getPublicNumbersCatalog: { method: "GET"; path: "/api/v1/public/numbers/catalog"; tag: "Phone numbers" };
  /** List countries in the public number catalogue */
  getPublicNumbersCatalogCountries: { method: "GET"; path: "/api/v1/public/numbers/catalog/countries"; tag: "Phone numbers" };
  /** List number types in the public number catalogue */
  getPublicNumbersCatalogTypes: { method: "GET"; path: "/api/v1/public/numbers/catalog/types"; tag: "Phone numbers" };
  /** List your route purchases */
  getPurchases: { method: "GET"; path: "/api/v1/purchases"; tag: "Purchases" };
  /** Get a purchase */
  getPurchasesById: { method: "GET"; path: "/api/v1/purchases/{id}"; tag: "Purchases" };
  /** List scheduled rate changes on a route you bought */
  getPurchasesByIdUpcomingRateChanges: { method: "GET"; path: "/api/v1/purchases/{id}/upcoming-rate-changes"; tag: "Purchases" };
  /** Get call counts, ASR and spend for a purchase */
  getPurchasesByIdUsage: { method: "GET"; path: "/api/v1/purchases/{id}/usage"; tag: "Purchases" };
  /** See which of your routes would carry a number */
  getPurchasesRouteFor: { method: "GET"; path: "/api/v1/purchases/route-for"; tag: "Purchases" };
  /** Get your voice routing order */
  getPurchasesRoutingOrder: { method: "GET"; path: "/api/v1/purchases/routing-order"; tag: "Purchases" };
  /** Get the public revenue share call log */
  getRevshareAccessLog: { method: "GET"; path: "/api/v1/revshare/access-log"; tag: "Revenue share numbers" };
  /** List the carrier paths that reach the pool */
  getRevshareAccessPaths: { method: "GET"; path: "/api/v1/revshare/access-paths"; tag: "Revenue share numbers" };
  /** Get your revenue share balance */
  getRevshareBalance: { method: "GET"; path: "/api/v1/revshare/balance"; tag: "Revenue share numbers" };
  /** List calls to your revenue share numbers */
  getRevshareCdrs: { method: "GET"; path: "/api/v1/revshare/cdrs"; tag: "Revenue share numbers" };
  /** List your IVR configurations */
  getRevshareIvrConfigs: { method: "GET"; path: "/api/v1/revshare/ivr-configs"; tag: "Revenue share numbers" };
  /** Play an IVR configuration's audio */
  getRevshareIvrConfigsByIdPreview: { method: "GET"; path: "/api/v1/revshare/ivr-configs/{id}/preview"; tag: "Revenue share numbers" };
  /** List the revenue share numbers you hold */
  getRevshareMyNumbers: { method: "GET"; path: "/api/v1/revshare/my-numbers"; tag: "Revenue share numbers" };
  /** Browse the revenue share number pool */
  getRevshareNumbers: { method: "GET"; path: "/api/v1/revshare/numbers"; tag: "Revenue share numbers" };
  /** List your revenue share payout requests */
  getRevsharePayouts: { method: "GET"; path: "/api/v1/revshare/payouts"; tag: "Revenue share numbers" };
  /** List revenue share rates by number type */
  getRevshareRates: { method: "GET"; path: "/api/v1/revshare/rates"; tag: "Revenue share numbers" };
  /** Get when each payout term next opens */
  getRevshareSchedule: { method: "GET"; path: "/api/v1/revshare/schedule"; tag: "Revenue share numbers" };
  /** Get a revenue share earnings statement */
  getRevshareStatement: { method: "GET"; path: "/api/v1/revshare/statement"; tag: "Revenue share numbers" };
  /** Get the IVR set on a number you hold */
  getRevshareTakingsByIdIvr: { method: "GET"; path: "/api/v1/revshare/takings/{id}/ivr"; tag: "Revenue share numbers" };
  /** Compare IVR variants on a number you hold */
  getRevshareTakingsByIdIvrStats: { method: "GET"; path: "/api/v1/revshare/takings/{id}/ivr-stats"; tag: "Revenue share numbers" };
  /** List access grants and requests on your private route */
  getRouteAccess: { method: "GET"; path: "/api/v1/route-access"; tag: "Route access" };
  /** Get one route conversation */
  getRouteMessagesByRouteIdByBuyerId: { method: "GET"; path: "/api/v1/route-messages/{routeId}/{buyerId}"; tag: "Route messages" };
  /** List your route conversations */
  getRouteMessagesThreads: { method: "GET"; path: "/api/v1/route-messages/threads"; tag: "Route messages" };
  /** List route problem reports you raised or received */
  getRouteReports: { method: "GET"; path: "/api/v1/route-reports"; tag: "Route reports" };
  /** Count route reports waiting on you */
  getRouteReportsActionCounts: { method: "GET"; path: "/api/v1/route-reports/action-counts"; tag: "Route reports" };
  /** Get a route report with its thread */
  getRouteReportsById: { method: "GET"; path: "/api/v1/route-reports/{id}"; tag: "Route reports" };
  /** Browse the route marketplace */
  getRoutes: { method: "GET"; path: "/api/v1/routes"; tag: "Marketplace routes" };
  /** List your blended routes */
  getRoutesBlends: { method: "GET"; path: "/api/v1/routes/blends"; tag: "Route blends" };
  /** Get a blended route */
  getRoutesBlendsById: { method: "GET"; path: "/api/v1/routes/blends/{id}"; tag: "Route blends" };
  /** Get a route */
  getRoutesById: { method: "GET"; path: "/api/v1/routes/{id}"; tag: "Marketplace routes" };
  /** List the buyers of your route */
  getRoutesByIdBuyers: { method: "GET"; path: "/api/v1/routes/{id}/buyers"; tag: "Marketplace routes" };
  /** List the per-country listings of a deck */
  getRoutesByIdChildren: { method: "GET"; path: "/api/v1/routes/{id}/children"; tag: "Rate sheets" };
  /** Get a route's price history */
  getRoutesByIdPriceHistory: { method: "GET"; path: "/api/v1/routes/{id}/price-history"; tag: "Marketplace routes" };
  /** List scheduled rate changes on your route */
  getRoutesByIdRateChanges: { method: "GET"; path: "/api/v1/routes/{id}/rate-changes"; tag: "Rate sheets" };
  /** Show the billing increments your rate sheet sets */
  getRoutesByIdRateIncrements: { method: "GET"; path: "/api/v1/routes/{id}/rate-increments"; tag: "Marketplace routes" };
  /** List per-destination rates on a route */
  getRoutesByIdRates: { method: "GET"; path: "/api/v1/routes/{id}/rates"; tag: "Rate sheets" };
  /** Export a route's rates as CSV */
  getRoutesByIdRatesExport: { method: "GET"; path: "/api/v1/routes/{id}/rates/export"; tag: "Rate sheets" };
  /** List rate-sheet imports for a route */
  getRoutesByIdRateSheets: { method: "GET"; path: "/api/v1/routes/{id}/rate-sheets"; tag: "Rate sheets" };
  /** Get a rate-sheet import */
  getRoutesByIdRateSheetsByImportId: { method: "GET"; path: "/api/v1/routes/{id}/rate-sheets/{importId}"; tag: "Rate sheets" };
  /** Get call screening settings, stats and flagged calls */
  getRoutesByIdScreening: { method: "GET"; path: "/api/v1/routes/{id}/screening"; tag: "Marketplace routes" };
  /** Preview the listings publishing a deck will create */
  getRoutesByIdSplitPreview: { method: "GET"; path: "/api/v1/routes/{id}/split-preview"; tag: "Marketplace routes" };
  /** Get traffic and revenue stats for your route */
  getRoutesByIdStats: { method: "GET"; path: "/api/v1/routes/{id}/stats"; tag: "Marketplace routes" };
  /** List your call-centre routes and their call screening */
  getRoutesCallguard: { method: "GET"; path: "/api/v1/routes/callguard"; tag: "Marketplace routes" };
  /** List destinations on the marketplace */
  getRoutesCountries: { method: "GET"; path: "/api/v1/routes/countries"; tag: "Marketplace routes" };
  /** List your recently deleted routes */
  getRoutesDeleted: { method: "GET"; path: "/api/v1/routes/deleted"; tag: "Marketplace routes" };
  /** List your saved listing presets */
  getRoutesListingPresets: { method: "GET"; path: "/api/v1/routes/listing-presets"; tag: "Marketplace routes" };
  /** List your saved SIP endpoints */
  getRoutesMyEndpoints: { method: "GET"; path: "/api/v1/routes/my-endpoints"; tag: "Marketplace routes" };
  /** List the routes you sell */
  getRoutesMyList: { method: "GET"; path: "/api/v1/routes/my/list"; tag: "Marketplace routes" };
  /** Count your listed routes that are live, and why the rest are hidden */
  getRoutesMyListingHealth: { method: "GET"; path: "/api/v1/routes/my/listing-health"; tag: "Marketplace routes" };
  /** Price a phone number across the marketplace */
  getRoutesPriceNumber: { method: "GET"; path: "/api/v1/routes/price-number"; tag: "Marketplace routes" };
  /** Preview which route would carry a destination */
  getRoutesResolve: { method: "GET"; path: "/api/v1/routes/resolve"; tag: "Marketplace routes" };
  /** Count your SMS routes hidden for lack of an endpoint */
  getRoutesSmsEndpointGap: { method: "GET"; path: "/api/v1/routes/sms-endpoint-gap"; tag: "Marketplace routes" };
  /** Get marketplace totals for a filter */
  getRoutesStats: { method: "GET"; path: "/api/v1/routes/stats"; tag: "Marketplace routes" };
  /** Subscribe to status updates as an RSS feed */
  getStatusFeedXml: { method: "GET"; path: "/api/v1/status/feed.xml"; tag: "Status" };
  /** List past incidents */
  getStatusIncidents: { method: "GET"; path: "/api/v1/status/incidents"; tag: "Status" };
  /** Get one incident with its updates */
  getStatusIncidentsById: { method: "GET"; path: "/api/v1/status/incidents/{id}"; tag: "Status" };
  /** Get the public status page */
  getStatusPage: { method: "GET"; path: "/api/v1/status/page"; tag: "Status" };
  /** Confirm a status subscription from the email link */
  getStatusSubscribeConfirm: { method: "GET"; path: "/api/v1/status/subscribe/confirm"; tag: "Status" };
  /** Unsubscribe from status updates from the email link */
  getStatusUnsubscribe: { method: "GET"; path: "/api/v1/status/unsubscribe"; tag: "Status" };
  /** List inbound IP ACLs for a customer or trunk */
  getSwitchAcls: { method: "GET"; path: "/api/v1/switch/acls"; tag: "Switch: routing" };
  /** Break down margin and quality by customer, supplier or destination */
  getSwitchAnalyticsBreakdown: { method: "GET"; path: "/api/v1/switch/analytics/breakdown"; tag: "Switch: CDRs and analytics" };
  /** Get margin and quality totals for all traffic */
  getSwitchAnalyticsOverview: { method: "GET"; path: "/api/v1/switch/analytics/overview"; tag: "Switch: CDRs and analytics" };
  /** Get daily margin and quality figures */
  getSwitchAnalyticsTimeseries: { method: "GET"; path: "/api/v1/switch/analytics/timeseries"; tag: "Switch: CDRs and analytics" };
  /** Get accounts-payable ageing */
  getSwitchApAging: { method: "GET"; path: "/api/v1/switch/ap-aging"; tag: "Switch: invoicing" };
  /** List approval policies */
  getSwitchApprovalPolicies: { method: "GET"; path: "/api/v1/switch/approval-policies"; tag: "Switch: team and audit" };
  /** List approval requests */
  getSwitchApprovals: { method: "GET"; path: "/api/v1/switch/approvals"; tag: "Switch: team and audit" };
  /** Get accounts-receivable ageing */
  getSwitchArAging: { method: "GET"; path: "/api/v1/switch/ar-aging"; tag: "Switch: invoicing" };
  /** Search the switch audit history */
  getSwitchAudit: { method: "GET"; path: "/api/v1/switch/audit"; tag: "Switch: team and audit" };
  /** Get the values available to filter the audit history by */
  getSwitchAuditFilterOptions: { method: "GET"; path: "/api/v1/switch/audit/filter-options"; tag: "Switch: team and audit" };
  /** Get the call-filter vocabulary */
  getSwitchCallFilters: { method: "GET"; path: "/api/v1/switch/call-filters"; tag: "Switch: CDRs and analytics" };
  /** List your recent call-record exports */
  getSwitchCdrExports: { method: "GET"; path: "/api/v1/switch/cdr-exports"; tag: "Switch: CDRs and analytics" };
  /** Get the status of a call-record export */
  getSwitchCdrExportsById: { method: "GET"; path: "/api/v1/switch/cdr-exports/{id}"; tag: "Switch: CDRs and analytics" };
  /** Get the values available to filter call records by */
  getSwitchCdrFilterOptions: { method: "GET"; path: "/api/v1/switch/cdr-filter-options"; tag: "Switch: CDRs and analytics" };
  /** Search call records */
  getSwitchCdrs: { method: "GET"; path: "/api/v1/switch/cdrs"; tag: "Switch: CDRs and analytics" };
  /** Get charts for the filtered call records */
  getSwitchCdrsAnalytics: { method: "GET"; path: "/api/v1/switch/cdrs/analytics"; tag: "Switch: CDRs and analytics" };
  /** Get one call record with attempts, SIP trace and timeline */
  getSwitchCdrsById: { method: "GET"; path: "/api/v1/switch/cdrs/{id}"; tag: "Switch: CDRs and analytics" };
  /** List the supplier attempts of a call */
  getSwitchCdrsByIdAttempts: { method: "GET"; path: "/api/v1/switch/cdrs/{id}/attempts"; tag: "Switch: CDRs and analytics" };
  /** Get the SIP trace of a call */
  getSwitchCdrsByIdTrace: { method: "GET"; path: "/api/v1/switch/cdrs/{id}/trace"; tag: "Switch: CDRs and analytics" };
  /** Download filtered call records as CSV */
  getSwitchCdrsCsv: { method: "GET"; path: "/api/v1/switch/cdrs.csv"; tag: "Switch: CDRs and analytics" };
  /** Count call records by filter value */
  getSwitchCdrsFacets: { method: "GET"; path: "/api/v1/switch/cdrs/facets"; tag: "Switch: CDRs and analytics" };
  /** Group failed calls by the dimensions they share */
  getSwitchCdrsFailureGroups: { method: "GET"; path: "/api/v1/switch/cdrs/failure-groups"; tag: "Switch: CDRs and analytics" };
  /** Break down failed calls by stage and reason */
  getSwitchCdrsFailureSummary: { method: "GET"; path: "/api/v1/switch/cdrs/failure-summary"; tag: "Switch: CDRs and analytics" };
  /** List saved call-record views */
  getSwitchCdrViews: { method: "GET"; path: "/api/v1/switch/cdr-views"; tag: "Switch: CDRs and analytics" };
  /** Get your saved call-records layout */
  getSwitchCdrWorkspace: { method: "GET"; path: "/api/v1/switch/cdr-workspace"; tag: "Switch: CDRs and analytics" };
  /** Analyse the cost and configured margin of a destination */
  getSwitchCostAnalysis: { method: "GET"; path: "/api/v1/switch/cost-analysis"; tag: "Switch: rating" };
  /** List the suppliers that can carry a customer's traffic */
  getSwitchCostAnalysisSuppliers: { method: "GET"; path: "/api/v1/switch/cost-analysis/suppliers"; tag: "Switch: rating" };
  /** List bilateral counterparties */
  getSwitchCounterparties: { method: "GET"; path: "/api/v1/switch/counterparties"; tag: "Switch: invoicing" };
  /** List credit notes */
  getSwitchCreditNotes: { method: "GET"; path: "/api/v1/switch/credit-notes"; tag: "Switch: invoicing" };
  /** List your Switch customers with live and 24-hour figures */
  getSwitchCustomers: { method: "GET"; path: "/api/v1/switch/customers"; tag: "Switch: customers" };
  /** Get a Switch customer */
  getSwitchCustomersById: { method: "GET"; path: "/api/v1/switch/customers/{id}"; tag: "Switch: customers" };
  /** List what needs attention on a Switch customer */
  getSwitchCustomersByIdAttention: { method: "GET"; path: "/api/v1/switch/customers/{id}/attention"; tag: "Switch: customers" };
  /** Get a Switch customer billing profile */
  getSwitchCustomersByIdBillingProfile: { method: "GET"; path: "/api/v1/switch/customers/{id}/billing-profile"; tag: "Switch: customers" };
  /** Get a Switch customer receivables summary */
  getSwitchCustomersByIdBillingSummary: { method: "GET"; path: "/api/v1/switch/customers/{id}/billing-summary"; tag: "Switch: customers" };
  /** List a Switch customer contacts */
  getSwitchCustomersByIdContacts: { method: "GET"; path: "/api/v1/switch/customers/{id}/contacts"; tag: "Switch: customers" };
  /** Reveal a Switch customer inbound SIP credentials */
  getSwitchCustomersByIdCredentials: { method: "GET"; path: "/api/v1/switch/customers/{id}/credentials"; tag: "Switch: customers" };
  /** Get a Switch customer credit position */
  getSwitchCustomersByIdCreditPosition: { method: "GET"; path: "/api/v1/switch/customers/{id}/credit-position"; tag: "Switch: customers" };
  /** List a Switch customer lifecycle history */
  getSwitchCustomersByIdHistory: { method: "GET"; path: "/api/v1/switch/customers/{id}/history"; tag: "Switch: customers" };
  /** List operational issues on a Switch customer */
  getSwitchCustomersByIdIssues: { method: "GET"; path: "/api/v1/switch/customers/{id}/issues"; tag: "Switch: customers" };
  /** Get a Switch customer lifecycle state and financial position */
  getSwitchCustomersByIdLifecycle: { method: "GET"; path: "/api/v1/switch/customers/{id}/lifecycle"; tag: "Switch: customers" };
  /** List internal notes on a Switch customer */
  getSwitchCustomersByIdNotes: { method: "GET"; path: "/api/v1/switch/customers/{id}/notes"; tag: "Switch: customers" };
  /** Get a Switch customer command-centre overview */
  getSwitchCustomersByIdOverview: { method: "GET"; path: "/api/v1/switch/customers/{id}/overview"; tag: "Switch: customers" };
  /** Preview how a payment would be allocated to invoices */
  getSwitchCustomersByIdPaymentsPreview: { method: "GET"; path: "/api/v1/switch/customers/{id}/payments/preview"; tag: "Switch: customers" };
  /** Get per-destination quality for a Switch customer */
  getSwitchCustomersByIdQuality: { method: "GET"; path: "/api/v1/switch/customers/{id}/quality"; tag: "Switch: customers" };
  /** Drill into one destination for a Switch customer */
  getSwitchCustomersByIdQualityDestination: { method: "GET"; path: "/api/v1/switch/customers/{id}/quality/destination"; tag: "Switch: customers" };
  /** Get a Switch customer routing assignment */
  getSwitchCustomersByIdRouting: { method: "GET"; path: "/api/v1/switch/customers/{id}/routing"; tag: "Switch: customers" };
  /** Get a Switch customer default sell deck and each trunk's deck */
  getSwitchCustomersByIdSellDeck: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-deck"; tag: "Switch: customers" };
  /** List a Switch customer sell rates with buy cost and margin */
  getSwitchCustomersByIdSellRates: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates"; tag: "Switch: customers" };
  /** Count a Switch customer sell rates by view */
  getSwitchCustomersByIdSellRatesCounts: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/counts"; tag: "Switch: customers" };
  /** Export a Switch customer sell rates as CSV */
  getSwitchCustomersByIdSellRatesCsv: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates.csv"; tag: "Switch: customers" };
  /** List sell-rate discontinuation events for a Switch customer */
  getSwitchCustomersByIdSellRatesDiscontinuations: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/discontinuations"; tag: "Switch: customers" };
  /** Get a Switch customer rate-change notice period and what is queued */
  getSwitchCustomersByIdSellRatesNotice: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/notice"; tag: "Switch: customers" };
  /** List a Switch customer queued sell-rate changes */
  getSwitchCustomersByIdSellRatesNoticeChanges: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/notice/changes"; tag: "Switch: customers" };
  /** Download a Switch customer queued sell-rate changes as CSV */
  getSwitchCustomersByIdSellRatesNoticeChangesCsv: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/notice/changes.csv"; tag: "Switch: customers" };
  /** List scheduled (future-dated) sell rates for a Switch customer */
  getSwitchCustomersByIdSellRatesScheduled: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/scheduled"; tag: "Switch: customers" };
  /** List upcoming sell-rate starts and ends for a Switch customer */
  getSwitchCustomersByIdSellRatesUpcoming: { method: "GET"; path: "/api/v1/switch/customers/{id}/sell-rates/upcoming"; tag: "Switch: customers" };
  /** List a Switch customer trunks with traffic */
  getSwitchCustomersByIdTrunks: { method: "GET"; path: "/api/v1/switch/customers/{id}/trunks"; tag: "Switch: customers" };
  /** List the trunk authentication methods available to you */
  getSwitchCustomerTrunksAuthModes: { method: "GET"; path: "/api/v1/switch/customer-trunks/auth-modes"; tag: "Switch: customer trunks" };
  /** List a trunk's addresses with overlaps and customer-level entries */
  getSwitchCustomerTrunksByTrunkIdAddresses: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/addresses"; tag: "Switch: customer trunks" };
  /** Reveal a Switch customer trunk's SIP credentials */
  getSwitchCustomerTrunksByTrunkIdCredentials: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/credentials"; tag: "Switch: customer trunks" };
  /** Get a trunk's credential history and last successful authentication */
  getSwitchCustomerTrunksByTrunkIdCredentialStatus: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/credential-status"; tag: "Switch: customer trunks" };
  /** Show the configuration actually in force on a trunk */
  getSwitchCustomerTrunksByTrunkIdEffectiveConfig: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/effective-config"; tag: "Switch: customer trunks" };
  /** List a trunk's allowed source addresses */
  getSwitchCustomerTrunksByTrunkIdIps: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/ips"; tag: "Switch: customer trunks" };
  /** List a trunk's sell rates with buy cost and margin */
  getSwitchCustomerTrunksByTrunkIdRates: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates"; tag: "Switch: customer trunks" };
  /** Count a trunk's sell rates by view */
  getSwitchCustomerTrunksByTrunkIdRatesCounts: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/counts"; tag: "Switch: customer trunks" };
  /** Export a trunk's sell rates as CSV */
  getSwitchCustomerTrunksByTrunkIdRatesCsv: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates.csv"; tag: "Switch: customer trunks" };
  /** List sell-rate discontinuation events on a trunk */
  getSwitchCustomerTrunksByTrunkIdRatesDiscontinuations: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/discontinuations"; tag: "Switch: customer trunks" };
  /** List scheduled (future-dated) sell rates on a trunk */
  getSwitchCustomerTrunksByTrunkIdRatesScheduled: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/scheduled"; tag: "Switch: customer trunks" };
  /** List upcoming sell-rate starts and ends on a trunk */
  getSwitchCustomerTrunksByTrunkIdRatesUpcoming: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/upcoming"; tag: "Switch: customer trunks" };
  /** Check whether a Switch customer trunk can be deleted */
  getSwitchCustomerTrunksByTrunkIdRemovability: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/removability"; tag: "Switch: customer trunks" };
  /** Show the route wired up for a trunk */
  getSwitchCustomerTrunksByTrunkIdRoutingPath: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/routing-path"; tag: "Switch: customer trunks" };
  /** Get the sell deck in force on a trunk */
  getSwitchCustomerTrunksByTrunkIdSellDeck: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/sell-deck"; tag: "Switch: customer trunks" };
  /** Preview a sell-deck assignment for a trunk */
  getSwitchCustomerTrunksByTrunkIdSellDeckPreview: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/sell-deck/preview"; tag: "Switch: customer trunks" };
  /** Preview what disabling, enabling or archiving a trunk would do */
  getSwitchCustomerTrunksByTrunkIdServiceImpact: { method: "GET"; path: "/api/v1/switch/customer-trunks/{trunkId}/service-impact"; tag: "Switch: customer trunks" };
  /** List dialplans */
  getSwitchDialplans: { method: "GET"; path: "/api/v1/switch/dialplans"; tag: "Switch: routing" };
  /** Get a dialplan with its rules */
  getSwitchDialplansById: { method: "GET"; path: "/api/v1/switch/dialplans/{id}"; tag: "Switch: routing" };
  /** Check whether a number is on a Do Not Call list */
  getSwitchDncCheck: { method: "GET"; path: "/api/v1/switch/dnc/check"; tag: "Switch: operations" };
  /** List which customers and trunks honour Do Not Call */
  getSwitchDncCustomers: { method: "GET"; path: "/api/v1/switch/dnc/customers"; tag: "Switch: operations" };
  /** List Do Not Call entries */
  getSwitchDncEntries: { method: "GET"; path: "/api/v1/switch/dnc/entries"; tag: "Switch: operations" };
  /** Download your Do Not Call list as CSV */
  getSwitchDncExport: { method: "GET"; path: "/api/v1/switch/dnc/export"; tag: "Switch: operations" };
  /** List calls refused or warned by Do Not Call */
  getSwitchDncHits: { method: "GET"; path: "/api/v1/switch/dnc/hits"; tag: "Switch: operations" };
  /** Get the Do Not Call setting of a customer or trunk */
  getSwitchDncHonor: { method: "GET"; path: "/api/v1/switch/dnc/honor"; tag: "Switch: operations" };
  /** Download a scrubbed file */
  getSwitchDncScrubById: { method: "GET"; path: "/api/v1/switch/dnc/scrub/{id}"; tag: "Switch: operations" };
  /** Get Do Not Call list sizes and recent hits */
  getSwitchDncSummary: { method: "GET"; path: "/api/v1/switch/dnc/summary"; tag: "Switch: operations" };
  /** Count customers, trunks, suppliers and other Switch records */
  getSwitchEntityCounts: { method: "GET"; path: "/api/v1/switch/entity-counts"; tag: "Switch" };
  /** See which senders rotate through many caller IDs */
  getSwitchFraudAniWatch: { method: "GET"; path: "/api/v1/switch/fraud/ani-watch"; tag: "Switch: operations" };
  /** Get the learned traffic baseline used for risk scoring */
  getSwitchFraudBaseline: { method: "GET"; path: "/api/v1/switch/fraud/baseline"; tag: "Switch: operations" };
  /** See which caller IDs are presented, and by whom */
  getSwitchFraudCliWatch: { method: "GET"; path: "/api/v1/switch/fraud/cli-watch"; tag: "Switch: operations" };
  /** List fraud screening events */
  getSwitchFraudEvents: { method: "GET"; path: "/api/v1/switch/fraud/events"; tag: "Switch: operations" };
  /** Get fraud screening settings */
  getSwitchFraudSettings: { method: "GET"; path: "/api/v1/switch/fraud/settings"; tag: "Switch: operations" };
  /** Count fraud screening events */
  getSwitchFraudSummary: { method: "GET"; path: "/api/v1/switch/fraud/summary"; tag: "Switch: operations" };
  /** Show what a blank rating or limit field inherits */
  getSwitchInheritedDefaults: { method: "GET"; path: "/api/v1/switch/inherited-defaults"; tag: "Switch: rating" };
  /** List customer invoices */
  getSwitchInvoices: { method: "GET"; path: "/api/v1/switch/invoices"; tag: "Switch: invoicing" };
  /** Get an invoice with lines, payments and history */
  getSwitchInvoicesById: { method: "GET"; path: "/api/v1/switch/invoices/{id}"; tag: "Switch: invoicing" };
  /** Download an invoice as PDF */
  getSwitchInvoicesByIdPdf: { method: "GET"; path: "/api/v1/switch/invoices/{id}/pdf"; tag: "Switch: invoicing" };
  /** Render an invoice as printable HTML */
  getSwitchInvoicesByIdPrint: { method: "GET"; path: "/api/v1/switch/invoices/{id}/print"; tag: "Switch: invoicing" };
  /** Download an invoice as XML */
  getSwitchInvoicesByIdXml: { method: "GET"; path: "/api/v1/switch/invoices/{id}/xml"; tag: "Switch: invoicing" };
  /** List operational issues */
  getSwitchIssues: { method: "GET"; path: "/api/v1/switch/issues"; tag: "Switch: operations" };
  /** Get an operational issue by reference */
  getSwitchIssuesByRef: { method: "GET"; path: "/api/v1/switch/issues/{ref}"; tag: "Switch: operations" };
  /** Get the history of an operational issue */
  getSwitchIssuesByRefTimeline: { method: "GET"; path: "/api/v1/switch/issues/{ref}/timeline"; tag: "Switch: operations" };
  /** Get the list-filter vocabulary */
  getSwitchListFilters: { method: "GET"; path: "/api/v1/switch/list-filters"; tag: "Switch: CDRs and analytics" };
  /** List calls in progress */
  getSwitchLive: { method: "GET"; path: "/api/v1/switch/live"; tag: "Switch: operations" };
  /** Get realised margin over a period */
  getSwitchMarginRealised: { method: "GET"; path: "/api/v1/switch/margin/realised"; tag: "Switch: rating" };
  /** List per-call realised margin */
  getSwitchMarginRealisedSessions: { method: "GET"; path: "/api/v1/switch/margin/realised/sessions"; tag: "Switch: rating" };
  /** Get the realised margin of one call */
  getSwitchMarginRealisedSessionsByCallUuid: { method: "GET"; path: "/api/v1/switch/margin/realised/sessions/{callUuid}"; tag: "Switch: rating" };
  /** Get your role and permissions on the switch */
  getSwitchMe: { method: "GET"; path: "/api/v1/switch/me"; tag: "Switch: team and audit" };
  /** Get your Switch console mode */
  getSwitchMode: { method: "GET"; path: "/api/v1/switch/mode"; tag: "Switch" };
  /** List netting runs */
  getSwitchNettingRuns: { method: "GET"; path: "/api/v1/switch/netting-runs"; tag: "Switch: invoicing" };
  /** List what needs attention first on the switch */
  getSwitchOperationsQueue: { method: "GET"; path: "/api/v1/switch/operations-queue"; tag: "Switch: operations" };
  /** List supplier payables */
  getSwitchPayables: { method: "GET"; path: "/api/v1/switch/payables"; tag: "Switch: invoicing" };
  /** Get a payable with lines and payments */
  getSwitchPayablesById: { method: "GET"; path: "/api/v1/switch/payables/{id}"; tag: "Switch: invoicing" };
  /** List providers with their trunks */
  getSwitchProviders: { method: "GET"; path: "/api/v1/switch/providers"; tag: "Switch: suppliers" };
  /** Get a provider with its trunks, endpoints and contacts */
  getSwitchProvidersById: { method: "GET"; path: "/api/v1/switch/providers/{id}"; tag: "Switch: suppliers" };
  /** List what is wrong with a provider right now */
  getSwitchProvidersByIdAlerts: { method: "GET"; path: "/api/v1/switch/providers/{id}/alerts"; tag: "Switch: suppliers" };
  /** Get the change history for a provider and its trunks */
  getSwitchProvidersByIdAudit: { method: "GET"; path: "/api/v1/switch/providers/{id}/audit"; tag: "Switch: suppliers" };
  /** Get call totals for a provider across its trunks */
  getSwitchProvidersByIdCallRecords: { method: "GET"; path: "/api/v1/switch/providers/{id}/call-records"; tag: "Switch: suppliers" };
  /** List a provider contacts */
  getSwitchProvidersByIdContacts: { method: "GET"; path: "/api/v1/switch/providers/{id}/contacts"; tag: "Switch: suppliers" };
  /** List billing disputes with a provider */
  getSwitchProvidersByIdDisputes: { method: "GET"; path: "/api/v1/switch/providers/{id}/disputes"; tag: "Switch: suppliers" };
  /** List a provider payables and unbilled cost */
  getSwitchProvidersByIdInvoices: { method: "GET"; path: "/api/v1/switch/providers/{id}/invoices"; tag: "Switch: suppliers" };
  /** Render the SBC gateway configuration for a provider */
  getSwitchProvidersByIdSbcProfile: { method: "GET"; path: "/api/v1/switch/providers/{id}/sbc-profile"; tag: "Switch: suppliers" };
  /** List supplier rate decks */
  getSwitchRateDecks: { method: "GET"; path: "/api/v1/switch/rate-decks"; tag: "Switch: rating" };
  /** Get a supplier rate deck */
  getSwitchRateDecksById: { method: "GET"; path: "/api/v1/switch/rate-decks/{id}"; tag: "Switch: rating" };
  /** Compare a rate deck with the prices in force */
  getSwitchRateDecksByIdDiff: { method: "GET"; path: "/api/v1/switch/rate-decks/{id}/diff"; tag: "Switch: rating" };
  /** List every version of a rate deck */
  getSwitchRateDecksByIdHistory: { method: "GET"; path: "/api/v1/switch/rate-decks/{id}/history"; tag: "Switch: rating" };
  /** Look up the buy and sell price for a destination */
  getSwitchRateLookup: { method: "GET"; path: "/api/v1/switch/rate-lookup"; tag: "Switch: rating" };
  /** List route groups */
  getSwitchRoutePlans: { method: "GET"; path: "/api/v1/switch/route-plans"; tag: "Switch: routing" };
  /** Get a route group with its suppliers */
  getSwitchRoutePlansById: { method: "GET"; path: "/api/v1/switch/route-plans/{id}"; tag: "Switch: routing" };
  /** Preview how a number would route */
  getSwitchRoutingPreview: { method: "GET"; path: "/api/v1/switch/routing/preview"; tag: "Switch: routing" };
  /** List saved route traces */
  getSwitchRoutingTraces: { method: "GET"; path: "/api/v1/switch/routing/traces"; tag: "Switch: routing" };
  /** Get a saved route trace */
  getSwitchRoutingTracesById: { method: "GET"; path: "/api/v1/switch/routing/traces/{id}"; tag: "Switch: routing" };
  /** List sell decks */
  getSwitchSellDecks: { method: "GET"; path: "/api/v1/switch/sell-decks"; tag: "Switch: rating" };
  /** Get a sell deck with its reach and versions */
  getSwitchSellDecksByDeckId: { method: "GET"; path: "/api/v1/switch/sell-decks/{deckId}"; tag: "Switch: rating" };
  /** List the prices in a sell deck */
  getSwitchSellDecksByDeckIdRates: { method: "GET"; path: "/api/v1/switch/sell-decks/{deckId}/rates"; tag: "Switch: rating" };
  /** List your operator sell rates */
  getSwitchSellRates: { method: "GET"; path: "/api/v1/switch/sell-rates"; tag: "Switch: rating" };
  /** List providers with their trunks */
  getSwitchSupplierAccounts: { method: "GET"; path: "/api/v1/switch/supplier-accounts"; tag: "Switch: suppliers" };
  /** Get a provider with its trunks, endpoints and contacts */
  getSwitchSupplierAccountsById: { method: "GET"; path: "/api/v1/switch/supplier-accounts/{id}"; tag: "Switch: suppliers" };
  /** List a provider contacts */
  getSwitchSupplierAccountsByIdContacts: { method: "GET"; path: "/api/v1/switch/supplier-accounts/{id}/contacts"; tag: "Switch: suppliers" };
  /** List supplier trunks */
  getSwitchSuppliers: { method: "GET"; path: "/api/v1/switch/suppliers"; tag: "Switch: suppliers" };
  /** Get a supplier trunk */
  getSwitchSuppliersById: { method: "GET"; path: "/api/v1/switch/suppliers/{id}"; tag: "Switch: suppliers" };
  /** List configuration versions of a supplier trunk */
  getSwitchSuppliersByIdConfigHistory: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/config-history"; tag: "Switch: suppliers" };
  /** Get one configuration version of a supplier trunk */
  getSwitchSuppliersByIdConfigHistoryByVersionId: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/config-history/{versionId}"; tag: "Switch: suppliers" };
  /** Reveal a supplier trunk SIP credentials */
  getSwitchSuppliersByIdCredentials: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/credentials"; tag: "Switch: suppliers" };
  /** List SIP endpoints of a supplier trunk */
  getSwitchSuppliersByIdEndpoints: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/endpoints"; tag: "Switch: suppliers" };
  /** Get the flap report for a supplier trunk */
  getSwitchSuppliersByIdFlapReport: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/flap-report"; tag: "Switch: suppliers" };
  /** List health events for a supplier trunk */
  getSwitchSuppliersByIdHealthEvents: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/health-events"; tag: "Switch: suppliers" };
  /** Get a supplier trunk overview and today figures */
  getSwitchSuppliersByIdOverview: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/overview"; tag: "Switch: suppliers" };
  /** List quality and fraud protection events for a supplier trunk */
  getSwitchSuppliersByIdProtectionEvents: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/protection-events"; tag: "Switch: suppliers" };
  /** Get quality by destination for a supplier trunk */
  getSwitchSuppliersByIdQuality: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/quality"; tag: "Switch: suppliers" };
  /** List the cost deck in force on a supplier trunk */
  getSwitchSuppliersByIdRates: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/rates"; tag: "Switch: suppliers" };
  /** List archived cost decks of a supplier trunk */
  getSwitchSuppliersByIdRatesArchived: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/rates/archived"; tag: "Switch: suppliers" };
  /** Review queued cost changes before they take effect */
  getSwitchSuppliersByIdRatesPendingReview: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/rates/pending-review"; tag: "Switch: suppliers" };
  /** List scheduled cost changes on a supplier trunk */
  getSwitchSuppliersByIdRatesScheduled: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/rates/scheduled"; tag: "Switch: suppliers" };
  /** Get the production readiness checklist for a supplier trunk */
  getSwitchSuppliersByIdReadiness: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/readiness"; tag: "Switch: suppliers" };
  /** Show where a supplier trunk sits in routing */
  getSwitchSuppliersByIdRouting: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/routing"; tag: "Switch: suppliers" };
  /** Render the SBC gateway configuration for a supplier trunk */
  getSwitchSuppliersByIdSbcProfile: { method: "GET"; path: "/api/v1/switch/suppliers/{id}/sbc-profile"; tag: "Switch: suppliers" };
  /** Get live metrics for active supplier trunks */
  getSwitchSuppliersLive: { method: "GET"; path: "/api/v1/switch/suppliers/live"; tag: "Switch: suppliers" };
  /** List team members and the available roles */
  getSwitchTeam: { method: "GET"; path: "/api/v1/switch/team"; tag: "Switch: team and audit" };
  /** Get whether supplier trunk changes need approval */
  getSwitchTrunkApprovalSetting: { method: "GET"; path: "/api/v1/switch/trunk-approval-setting"; tag: "Switch: customer trunks" };
  /** List trunk configuration changes awaiting or after review */
  getSwitchTrunkChanges: { method: "GET"; path: "/api/v1/switch/trunk-changes"; tag: "Switch: customer trunks" };
  /** Get whether trunk readiness blocks first activation */
  getSwitchTrunkReadinessSetting: { method: "GET"; path: "/api/v1/switch/trunk-readiness-setting"; tag: "Switch: customer trunks" };
  /** Get traffic usage for one customer */
  getSwitchUsage: { method: "GET"; path: "/api/v1/switch/usage"; tag: "Switch: CDRs and analytics" };
  /** List your support tickets */
  getTickets: { method: "GET"; path: "/api/v1/tickets"; tag: "Support" };
  /** Get a support ticket with its messages */
  getTicketsById: { method: "GET"; path: "/api/v1/tickets/{id}"; tag: "Support" };
  /** List your top-ups */
  getTopups: { method: "GET"; path: "/api/v1/topups"; tag: "Top-ups" };
  /** Get your auto-recharge settings */
  getTopupsAutoRecharge: { method: "GET"; path: "/api/v1/topups/auto-recharge"; tag: "Top-ups" };
  /** List available top-up methods and their limits */
  getTopupsMethods: { method: "GET"; path: "/api/v1/topups/methods"; tag: "Top-ups" };
  /** List your saved cards */
  getTopupsPaymentMethods: { method: "GET"; path: "/api/v1/topups/payment-methods"; tag: "Top-ups" };
  /** List your pending top-ups with payment instructions */
  getTopupsPending: { method: "GET"; path: "/api/v1/topups/pending"; tag: "Top-ups" };
  /** Get your US calling compliance profile */
  getUsComplianceProfile: { method: "GET"; path: "/api/v1/us-compliance/profile"; tag: "Compliance" };
  /** Check whether a route needs a US compliance profile */
  getUsComplianceRouteByRouteIdRequirement: { method: "GET"; path: "/api/v1/us-compliance/route/{routeId}/requirement"; tag: "Compliance" };
  /** Get your US compliance review status */
  getUsComplianceStatus: { method: "GET"; path: "/api/v1/us-compliance/status"; tag: "Compliance" };
  /** Get the state of a verification */
  getVerifyById: { method: "GET"; path: "/api/v1/verify/{id}"; tag: "Verify" };
  /** Rename an API key or narrow its scopes */
  patchAccountApiKeysById: { method: "PATCH"; path: "/api/v1/account/api-keys/{id}"; tag: "API keys" };
  /** Update a webhook endpoint */
  patchAccountWebhooksById: { method: "PATCH"; path: "/api/v1/account/webhooks/{id}"; tag: "Webhooks" };
  /** Update an AI voice agent */
  patchAiAgentsById: { method: "PATCH"; path: "/api/v1/ai-agents/{id}"; tag: "AI voice agents" };
  /** Update a sub-account */
  patchApplicationSubAccountsById: { method: "PATCH"; path: "/api/v1/application/sub-accounts/{id}"; tag: "Application Manager" };
  /** Rename or describe a caller-ID set */
  patchDialerCallerIdsById: { method: "PATCH"; path: "/api/v1/dialer/caller-ids/{id}"; tag: "Dialer" };
  /** Update one caller ID in a set */
  patchDialerCallerIdsByIdNumbersByNid: { method: "PATCH"; path: "/api/v1/dialer/caller-ids/{id}/numbers/{nid}"; tag: "Dialer" };
  /** Update an SMS template */
  patchDialerTemplatesById: { method: "PATCH"; path: "/api/v1/dialer/templates/{id}"; tag: "Dialer" };
  /** Turn monthly auto-renew on or off */
  patchDidsByIdAutoRenew: { method: "PATCH"; path: "/api/v1/dids/{id}/auto-renew"; tag: "Phone numbers" };
  /** Point a number at one destination (and an optional backup) */
  patchDidsByIdRouting: { method: "PATCH"; path: "/api/v1/dids/{id}/routing"; tag: "Phone numbers" };
  /** Accept, reject, counter or withdraw an offer */
  patchOffersById: { method: "PATCH"; path: "/api/v1/offers/{id}"; tag: "Offers" };
  /** Pause or resume a purchase */
  patchPurchasesById: { method: "PATCH"; path: "/api/v1/purchases/{id}"; tag: "Purchases" };
  /** Set a purchase's routing position */
  patchPurchasesByIdRoutingPriority: { method: "PATCH"; path: "/api/v1/purchases/{id}/routing-priority"; tag: "Purchases" };
  /** Update an IVR configuration */
  patchRevshareIvrConfigsById: { method: "PATCH"; path: "/api/v1/revshare/ivr-configs/{id}"; tag: "Revenue share numbers" };
  /** Attach an IVR to a number you hold */
  patchRevshareTakingsById: { method: "PATCH"; path: "/api/v1/revshare/takings/{id}"; tag: "Revenue share numbers" };
  /** Change the custom price on an access grant */
  patchRouteAccessById: { method: "PATCH"; path: "/api/v1/route-access/{id}"; tag: "Route access" };
  /** Update a blended route */
  patchRoutesBlendsById: { method: "PATCH"; path: "/api/v1/routes/blends/{id}"; tag: "Route blends" };
  /** Edit or block one rate in your deck */
  patchRoutesByIdRatesByRateId: { method: "PATCH"; path: "/api/v1/routes/{id}/rates/{rateId}"; tag: "Rate sheets" };
  /** Turn call screening on or off for a route */
  patchRoutesByIdScreening: { method: "PATCH"; path: "/api/v1/routes/{id}/screening"; tag: "Marketplace routes" };
  /** Label a saved SIP endpoint */
  patchRoutesMyEndpointsById: { method: "PATCH"; path: "/api/v1/routes/my-endpoints/{id}"; tag: "Marketplace routes" };
  /** Update a bilateral counterparty */
  patchSwitchCounterpartiesById: { method: "PATCH"; path: "/api/v1/switch/counterparties/{id}"; tag: "Switch: invoicing" };
  /** Update a Switch customer */
  patchSwitchCustomersById: { method: "PATCH"; path: "/api/v1/switch/customers/{id}"; tag: "Switch: customers" };
  /** Update a Switch customer contact */
  patchSwitchCustomersByIdContactsByContactId: { method: "PATCH"; path: "/api/v1/switch/customers/{id}/contacts/{contactId}"; tag: "Switch: customers" };
  /** Edit, pin or flag a Switch customer note */
  patchSwitchCustomersByIdNotesByNoteId: { method: "PATCH"; path: "/api/v1/switch/customers/{id}/notes/{noteId}"; tag: "Switch: customers" };
  /** Update a Switch customer trunk */
  patchSwitchCustomerTrunksByTrunkId: { method: "PATCH"; path: "/api/v1/switch/customer-trunks/{trunkId}"; tag: "Switch: customer trunks" };
  /** Rename, describe, enable or disable a dialplan */
  patchSwitchDialplansById: { method: "PATCH"; path: "/api/v1/switch/dialplans/{id}"; tag: "Switch: routing" };
  /** Turn Do Not Call on or off for a customer or trunk */
  patchSwitchDncHonor: { method: "PATCH"; path: "/api/v1/switch/dnc/honor"; tag: "Switch: operations" };
  /** Update a provider */
  patchSwitchProvidersById: { method: "PATCH"; path: "/api/v1/switch/providers/{id}"; tag: "Switch: suppliers" };
  /** Update a provider contact */
  patchSwitchProvidersByIdContactsByContactId: { method: "PATCH"; path: "/api/v1/switch/providers/{id}/contacts/{contactId}"; tag: "Switch: suppliers" };
  /** Update a billing dispute */
  patchSwitchProvidersByIdDisputesByDisputeId: { method: "PATCH"; path: "/api/v1/switch/providers/{id}/disputes/{disputeId}"; tag: "Switch: suppliers" };
  /** Update a route group's settings */
  patchSwitchRoutePlansById: { method: "PATCH"; path: "/api/v1/switch/route-plans/{id}"; tag: "Switch: routing" };
  /** Update a sell deck's name, notes or charging profile */
  patchSwitchSellDecksByDeckId: { method: "PATCH"; path: "/api/v1/switch/sell-decks/{deckId}"; tag: "Switch: rating" };
  /** Update a provider */
  patchSwitchSupplierAccountsById: { method: "PATCH"; path: "/api/v1/switch/supplier-accounts/{id}"; tag: "Switch: suppliers" };
  /** Update a provider contact */
  patchSwitchSupplierAccountsByIdContactsByContactId: { method: "PATCH"; path: "/api/v1/switch/supplier-accounts/{id}/contacts/{contactId}"; tag: "Switch: suppliers" };
  /** Update a supplier trunk */
  patchSwitchSuppliersById: { method: "PATCH"; path: "/api/v1/switch/suppliers/{id}"; tag: "Switch: suppliers" };
  /** Update a SIP endpoint */
  patchSwitchSuppliersByIdEndpointsByEndpointId: { method: "PATCH"; path: "/api/v1/switch/suppliers/{id}/endpoints/{endpointId}"; tag: "Switch: suppliers" };
  /** Change a team member's role, scope or status */
  patchSwitchTeamByMemberId: { method: "PATCH"; path: "/api/v1/switch/team/{memberId}"; tag: "Switch: team and audit" };
  /** Turn off two-factor authentication */
  postAccount2faDisable: { method: "POST"; path: "/api/v1/account/2fa/disable"; tag: "Account" };
  /** Turn on two-factor authentication */
  postAccount2faEnable: { method: "POST"; path: "/api/v1/account/2fa/enable"; tag: "Account" };
  /** Start two-factor authentication setup */
  postAccount2faSetup: { method: "POST"; path: "/api/v1/account/2fa/setup"; tag: "Account" };
  /** Create an API key */
  postAccountApiKeys: { method: "POST"; path: "/api/v1/account/api-keys"; tag: "API keys" };
  /** Close your account */
  postAccountClose: { method: "POST"; path: "/api/v1/account/close"; tag: "Account" };
  /** Request an email address change */
  postAccountEmail: { method: "POST"; path: "/api/v1/account/email"; tag: "Account" };
  /** Confirm an email change from a signed-in session */
  postAccountEmailConfirm: { method: "POST"; path: "/api/v1/account/email/confirm"; tag: "Account" };
  /** Add a route to your favorites */
  postAccountFavorites: { method: "POST"; path: "/api/v1/account/favorites"; tag: "Account" };
  /** Take a dedicated ingress IP */
  postAccountIpsActivate: { method: "POST"; path: "/api/v1/account/ips/activate"; tag: "Account" };
  /** Take a dedicated egress IP */
  postAccountIpsActivateEgress: { method: "POST"; path: "/api/v1/account/ips/activate-egress"; tag: "Account" };
  /** Release a dedicated IP */
  postAccountIpsByIdRelease: { method: "POST"; path: "/api/v1/account/ips/{id}/release"; tag: "Account" };
  /** Save your onboarding goal */
  postAccountOnboarding: { method: "POST"; path: "/api/v1/account/onboarding"; tag: "Account" };
  /** Save a marketplace search */
  postAccountSavedSearches: { method: "POST"; path: "/api/v1/account/saved-searches"; tag: "Account" };
  /** Start a Switch subscription checkout */
  postAccountSwitchSubscriptionCheckout: { method: "POST"; path: "/api/v1/account/switch-subscription/checkout"; tag: "Account" };
  /** Open the Switch billing portal */
  postAccountSwitchSubscriptionPortal: { method: "POST"; path: "/api/v1/account/switch-subscription/portal"; tag: "Account" };
  /** Apply for a Switch free trial */
  postAccountSwitchTrialApplication: { method: "POST"; path: "/api/v1/account/switch-trial-application"; tag: "Account" };
  /** Create a webhook endpoint */
  postAccountWebhooks: { method: "POST"; path: "/api/v1/account/webhooks"; tag: "Webhooks" };
  /** Rotate a webhook signing secret */
  postAccountWebhooksByIdRotateSecret: { method: "POST"; path: "/api/v1/account/webhooks/{id}/rotate-secret"; tag: "Webhooks" };
  /** Send a test ping to a webhook endpoint */
  postAccountWebhooksByIdTest: { method: "POST"; path: "/api/v1/account/webhooks/{id}/test"; tag: "Webhooks" };
  /** Resend a webhook delivery */
  postAccountWebhooksDeliveriesByDeliveryIdResend: { method: "POST"; path: "/api/v1/account/webhooks/deliveries/{deliveryId}/resend"; tag: "Webhooks" };
  /** Create an AI voice agent */
  postAiAgents: { method: "POST"; path: "/api/v1/ai-agents"; tag: "AI voice agents" };
  /** Simulate one conversation turn with an agent */
  postAiAgentsByIdSimulate: { method: "POST"; path: "/api/v1/ai-agents/{id}/simulate"; tag: "AI voice agents" };
  /** Draft an agent from a plain-English description */
  postAiAgentsDraft: { method: "POST"; path: "/api/v1/ai-agents/draft"; tag: "AI voice agents" };
  /** Hear a voice speak a short line */
  postAiAgentsVoicesPreview: { method: "POST"; path: "/api/v1/ai-agents/voices/preview"; tag: "AI voice agents" };
  /** Create a sub-account */
  postApplicationSubAccounts: { method: "POST"; path: "/api/v1/application/sub-accounts"; tag: "Application Manager" };
  /** Create up to 100 sub-accounts at once */
  postApplicationSubAccountsBulk: { method: "POST"; path: "/api/v1/application/sub-accounts/bulk"; tag: "Application Manager" };
  /** Issue an API key for a sub-account */
  postApplicationSubAccountsByIdApiKeys: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/api-keys"; tag: "Application Manager" };
  /** Close a sub-account */
  postApplicationSubAccountsByIdClose: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/close"; tag: "Application Manager" };
  /** Fund a sub-account from your balance */
  postApplicationSubAccountsByIdCredit: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/credit"; tag: "Application Manager" };
  /** Return funds from a sub-account to your balance */
  postApplicationSubAccountsByIdDebit: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/debit"; tag: "Application Manager" };
  /** Record a payment a sub-account made to you */
  postApplicationSubAccountsByIdPayment: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/payment"; tag: "Application Manager" };
  /** Reverse a recorded sub-account payment */
  postApplicationSubAccountsByIdPaymentCorrection: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/payment-correction"; tag: "Application Manager" };
  /** Set a sub-account's portal email and send a sign-in link */
  postApplicationSubAccountsByIdPortalInvite: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/portal-invite"; tag: "Application Manager" };
  /** Regenerate a sub-account SIP password */
  postApplicationSubAccountsByIdSipPassword: { method: "POST"; path: "/api/v1/application/sub-accounts/{id}/sip-password"; tag: "Application Manager" };
  /** Complete a two-factor login */
  postAuth2faVerify: { method: "POST"; path: "/api/v1/auth/2fa/verify"; tag: "Authentication" };
  /** Change your password */
  postAuthChangePassword: { method: "POST"; path: "/api/v1/auth/change-password"; tag: "Authentication" };
  /** Confirm an email address change */
  postAuthConfirmEmailChange: { method: "POST"; path: "/api/v1/auth/confirm-email-change"; tag: "Authentication" };
  /** Request a password reset email */
  postAuthForgotPassword: { method: "POST"; path: "/api/v1/auth/forgot-password"; tag: "Authentication" };
  /** Redeem an invite code after sign-up */
  postAuthInviteRedeem: { method: "POST"; path: "/api/v1/auth/invite/redeem"; tag: "Authentication" };
  /** Log in with email and password */
  postAuthLogin: { method: "POST"; path: "/api/v1/auth/login"; tag: "Authentication" };
  /** Log out the current session */
  postAuthLogout: { method: "POST"; path: "/api/v1/auth/logout"; tag: "Authentication" };
  /** Refresh an access token */
  postAuthRefresh: { method: "POST"; path: "/api/v1/auth/refresh"; tag: "Authentication" };
  /** Create an account */
  postAuthRegister: { method: "POST"; path: "/api/v1/auth/register"; tag: "Authentication" };
  /** Resend the verification email */
  postAuthResendVerification: { method: "POST"; path: "/api/v1/auth/resend-verification"; tag: "Authentication" };
  /** Resend a verification email by address */
  postAuthResendVerificationPublic: { method: "POST"; path: "/api/v1/auth/resend-verification-public"; tag: "Authentication" };
  /** Reset your password with a reset token */
  postAuthResetPassword: { method: "POST"; path: "/api/v1/auth/reset-password"; tag: "Authentication" };
  /** Sign out every other session */
  postAuthSessionsRevokeOthers: { method: "POST"; path: "/api/v1/auth/sessions/revoke-others"; tag: "Authentication" };
  /** Verify your email address */
  postAuthVerifyEmail: { method: "POST"; path: "/api/v1/auth/verify-email"; tag: "Authentication" };
  /** Start a background call-record export */
  postBillingExports: { method: "POST"; path: "/api/v1/billing/exports"; tag: "Billing" };
  /** Generate the tax invoice for a month */
  postBillingTaxInvoicesGenerate: { method: "POST"; path: "/api/v1/billing/tax-invoices/generate"; tag: "Billing" };
  /** Run a caller-ID test on a route */
  postCliTests: { method: "POST"; path: "/api/v1/cli-tests"; tag: "CLI tests" };
  /** Start a route liveness test on several routes */
  postCliTestsBatches: { method: "POST"; path: "/api/v1/cli-tests/batches"; tag: "CLI tests" };
  /** Cancel a running route liveness test */
  postCliTestsBatchesByIdCancel: { method: "POST"; path: "/api/v1/cli-tests/batches/{id}/cancel"; tag: "CLI tests" };
  /** Preview a route liveness test before starting it */
  postCliTestsBatchesPreview: { method: "POST"; path: "/api/v1/cli-tests/batches/preview"; tag: "CLI tests" };
  /** Cancel a pending or scheduled caller-ID test */
  postCliTestsByIdCancel: { method: "POST"; path: "/api/v1/cli-tests/{id}/cancel"; tag: "CLI tests" };
  /** Test a caller ID on your own switch */
  postCliTestsQuick: { method: "POST"; path: "/api/v1/cli-tests/quick"; tag: "CLI tests" };
  /** Place a single outbound call */
  postCommsCalls: { method: "POST"; path: "/api/v1/comms/calls"; tag: "Voice and SMS" };
  /** Send a single SMS */
  postCommsSms: { method: "POST"; path: "/api/v1/comms/sms"; tag: "Voice and SMS" };
  /** Send up to 1,000 SMS in one request */
  postCommsSmsBulk: { method: "POST"; path: "/api/v1/comms/sms/bulk"; tag: "Voice and SMS" };
  /** Read a one-time passcode to a phone by voice call */
  postCommsVoiceOtp: { method: "POST"; path: "/api/v1/comms/voice-otp"; tag: "Verify" };
  /** Share or stop sharing your private routes with a connection */
  postConnectionsByIdSharePrivate: { method: "POST"; path: "/api/v1/connections/{id}/share-private"; tag: "Connections" };
  /** Rotate your connect code */
  postConnectionsCodeRotate: { method: "POST"; path: "/api/v1/connections/code/rotate"; tag: "Connections" };
  /** Connect with another account by its code */
  postConnectionsConnect: { method: "POST"; path: "/api/v1/connections/connect"; tag: "Connections" };
  /** Ask the dialer assistant a question or give it an instruction */
  postDialerAgentAsk: { method: "POST"; path: "/api/v1/dialer/agent/ask"; tag: "Dialer" };
  /** Create a caller-ID set */
  postDialerCallerIds: { method: "POST"; path: "/api/v1/dialer/caller-ids"; tag: "Dialer" };
  /** Add your revenue share numbers to a caller-ID set */
  postDialerCallerIdsByIdFromRevshare: { method: "POST"; path: "/api/v1/dialer/caller-ids/{id}/from-revshare"; tag: "Dialer" };
  /** Add caller IDs to a set */
  postDialerCallerIdsByIdNumbers: { method: "POST"; path: "/api/v1/dialer/caller-ids/{id}/numbers"; tag: "Dialer" };
  /** Enable, disable or delete many caller IDs in a set */
  postDialerCallerIdsByIdNumbersBulk: { method: "POST"; path: "/api/v1/dialer/caller-ids/{id}/numbers/bulk"; tag: "Dialer" };
  /** Create a dialer or SMS campaign */
  postDialerCampaigns: { method: "POST"; path: "/api/v1/dialer/campaigns"; tag: "Dialer" };
  /** Add caller IDs to a campaign */
  postDialerCampaignsByIdClis: { method: "POST"; path: "/api/v1/dialer/campaigns/{id}/clis"; tag: "Dialer" };
  /** Start, pause or stop a campaign */
  postDialerCampaignsByIdControl: { method: "POST"; path: "/api/v1/dialer/campaigns/{id}/control"; tag: "Dialer" };
  /** Add destination numbers to a campaign */
  postDialerCampaignsByIdNumbers: { method: "POST"; path: "/api/v1/dialer/campaigns/{id}/numbers"; tag: "Dialer" };
  /** Mark a draft campaign ready to start */
  postDialerCampaignsByIdReady: { method: "POST"; path: "/api/v1/dialer/campaigns/{id}/ready"; tag: "Dialer" };
  /** Create a simple caller-ID list */
  postDialerCliSets: { method: "POST"; path: "/api/v1/dialer/cli-sets"; tag: "Dialer" };
  /** Create a saved contact list */
  postDialerContactLists: { method: "POST"; path: "/api/v1/dialer/contact-lists"; tag: "Dialer" };
  /** Import mapped contacts into a campaign or a saved list */
  postDialerContactsImport: { method: "POST"; path: "/api/v1/dialer/contacts/import"; tag: "Dialer" };
  /** Parse a contact file and suggest a column mapping */
  postDialerContactsParse: { method: "POST"; path: "/api/v1/dialer/contacts/parse"; tag: "Dialer" };
  /** Match inbound callers to a caller-ID set and optionally save them */
  postDialerTargetListsCompatible: { method: "POST"; path: "/api/v1/dialer/target-lists/compatible"; tag: "Dialer" };
  /** Build a call-back list from callers to your revenue share numbers */
  postDialerTargetListsFromRevshareCdr: { method: "POST"; path: "/api/v1/dialer/target-lists/from-revshare-cdr"; tag: "Dialer" };
  /** Preview a cleaned number list */
  postDialerTargetListsRefine: { method: "POST"; path: "/api/v1/dialer/target-lists/refine"; tag: "Dialer" };
  /** Save numbers as a contact list */
  postDialerTargetListsSave: { method: "POST"; path: "/api/v1/dialer/target-lists/save"; tag: "Dialer" };
  /** Create an SMS template */
  postDialerTemplates: { method: "POST"; path: "/api/v1/dialer/templates"; tag: "Dialer" };
  /** Buy several phone numbers in one request */
  postDidsBulkBuy: { method: "POST"; path: "/api/v1/dids/bulk-buy"; tag: "Phone numbers" };
  /** Buy a phone number */
  postDidsBuy: { method: "POST"; path: "/api/v1/dids/buy"; tag: "Phone numbers" };
  /** Upload a voicemail or IVR greeting */
  postDidsByIdGreetings: { method: "POST"; path: "/api/v1/dids/{id}/greetings"; tag: "Phone numbers" };
  /** Send an SMS from one of your numbers */
  postDidsByIdMessages: { method: "POST"; path: "/api/v1/dids/{id}/messages"; tag: "Phone numbers" };
  /** Mark an SMS conversation read */
  postDidsByIdMessagesRead: { method: "POST"; path: "/api/v1/dids/{id}/messages/read"; tag: "Phone numbers" };
  /** Release a phone number */
  postDidsByIdRelease: { method: "POST"; path: "/api/v1/dids/{id}/release"; tag: "Phone numbers" };
  /** Create a softphone line on a number */
  postDidsByIdSipLines: { method: "POST"; path: "/api/v1/dids/{id}/sip-lines"; tag: "Phone numbers" };
  /** Reveal a softphone line's login */
  postDidsByIdSipLinesByLineIdReveal: { method: "POST"; path: "/api/v1/dids/{id}/sip-lines/{lineId}/reveal"; tag: "Phone numbers" };
  /** Mark a voicemail heard or unheard */
  postDidsByIdVoicemailsByRecIdHeard: { method: "POST"; path: "/api/v1/dids/{id}/voicemails/{recId}/heard"; tag: "Phone numbers" };
  /** Ask to list your numbers on the marketplace */
  postDidsListingRequest: { method: "POST"; path: "/api/v1/dids/listing-request"; tag: "Phone numbers" };
  /** Add your numbers to a dialer caller-ID set */
  postDidsToCliSet: { method: "POST"; path: "/api/v1/dids/to-cli-set"; tag: "Phone numbers" };
  /** Add a number to your do-not-call list */
  postDnc: { method: "POST"; path: "/api/v1/dnc"; tag: "Do not call" };
  /** Add many numbers to your do-not-call list */
  postDncBulk: { method: "POST"; path: "/api/v1/dnc/bulk"; tag: "Do not call" };
  /** Check whether a call to a destination would be accepted */
  postFirstCallReadiness: { method: "POST"; path: "/api/v1/first-call/readiness"; tag: "Onboarding" };
  /** Activate your own switch address */
  postFirstCallSwitchAddress: { method: "POST"; path: "/api/v1/first-call/switch-address"; tag: "Onboarding" };
  /** Rotate the SIP and SMPP credentials on a purchase */
  postInterconnectionsByPurchaseIdRotateCredentials: { method: "POST"; path: "/api/v1/interconnections/{purchaseId}/rotate-credentials"; tag: "Interconnections" };
  /** Whitelist a source IP for your traffic */
  postInterconnectionsIps: { method: "POST"; path: "/api/v1/interconnections/ips"; tag: "Interconnections" };
  /** Test connectivity on a purchased route */
  postInterconnectionsTest: { method: "POST"; path: "/api/v1/interconnections/test"; tag: "Interconnections" };
  /** Start identity verification */
  postKycStart: { method: "POST"; path: "/api/v1/kyc/start"; tag: "Compliance" };
  /** Create a route from a saved draft listing */
  postListingsByTokenClaim: { method: "POST"; path: "/api/v1/listings/{token}/claim"; tag: "Marketplace routes" };
  /** Mark a notification as read */
  postNotificationsByIdRead: { method: "POST"; path: "/api/v1/notifications/{id}/read"; tag: "Notifications" };
  /** Mark all notifications as read */
  postNotificationsReadAll: { method: "POST"; path: "/api/v1/notifications/read-all"; tag: "Notifications" };
  /** Make an offer on a route */
  postOffers: { method: "POST"; path: "/api/v1/offers"; tag: "Offers" };
  /** Make offers on several routes at once */
  postOffersBulk: { method: "POST"; path: "/api/v1/offers/bulk"; tag: "Offers" };
  /** Accept or reject every open offer in a bulk offer */
  postOffersGroupsByIdRespond: { method: "POST"; path: "/api/v1/offers/groups/{id}/respond"; tag: "Offers" };
  /** Request a payout of your seller balance */
  postPayouts: { method: "POST"; path: "/api/v1/payouts"; tag: "Payouts" };
  /** Save a draft listing to claim after sign-up */
  postPublicListings: { method: "POST"; path: "/api/v1/public/listings"; tag: "Marketplace routes" };
  /** Read a rate sheet into a draft listing (no account needed) */
  postPublicListingsParse: { method: "POST"; path: "/api/v1/public/listings/parse"; tag: "Marketplace routes" };
  /** Buy access to a marketplace route */
  postPurchases: { method: "POST"; path: "/api/v1/purchases"; tag: "Purchases" };
  /** Accept a seller's rate increase */
  postPurchasesByIdAcceptRate: { method: "POST"; path: "/api/v1/purchases/{id}/accept-rate"; tag: "Purchases" };
  /** Create an IVR configuration */
  postRevshareIvrConfigs: { method: "POST"; path: "/api/v1/revshare/ivr-configs"; tag: "Revenue share numbers" };
  /** Generate the audio for a text-to-speech IVR */
  postRevshareIvrConfigsByIdGenerate: { method: "POST"; path: "/api/v1/revshare/ivr-configs/{id}/generate"; tag: "Revenue share numbers" };
  /** Preview text-to-speech audio before saving */
  postRevshareIvrConfigsPreview: { method: "POST"; path: "/api/v1/revshare/ivr-configs/preview"; tag: "Revenue share numbers" };
  /** Upload audio for an IVR */
  postRevshareIvrConfigsUpload: { method: "POST"; path: "/api/v1/revshare/ivr-configs/upload"; tag: "Revenue share numbers" };
  /** Take a revenue share number */
  postRevshareNumbersByIdTake: { method: "POST"; path: "/api/v1/revshare/numbers/{id}/take"; tag: "Revenue share numbers" };
  /** Request a revenue share payout */
  postRevsharePayouts: { method: "POST"; path: "/api/v1/revshare/payouts"; tag: "Revenue share numbers" };
  /** Take one number of every available type */
  postRevshareTakeOneOfEach: { method: "POST"; path: "/api/v1/revshare/take-one-of-each"; tag: "Revenue share numbers" };
  /** Release a revenue share number back to the pool */
  postRevshareTakingsByIdRelease: { method: "POST"; path: "/api/v1/revshare/takings/{id}/release"; tag: "Revenue share numbers" };
  /** Grant a buyer access to your private route */
  postRouteAccess: { method: "POST"; path: "/api/v1/route-access"; tag: "Route access" };
  /** Approve an access request */
  postRouteAccessByIdApprove: { method: "POST"; path: "/api/v1/route-access/{id}/approve"; tag: "Route access" };
  /** Request access to a private route */
  postRouteAccessRequest: { method: "POST"; path: "/api/v1/route-access/request"; tag: "Route access" };
  /** Send a message about a route */
  postRouteMessages: { method: "POST"; path: "/api/v1/route-messages"; tag: "Route messages" };
  /** Report a problem with a route you bought */
  postRouteReports: { method: "POST"; path: "/api/v1/route-reports"; tag: "Route reports" };
  /** Acknowledge a route report (seller) */
  postRouteReportsByIdAcknowledge: { method: "POST"; path: "/api/v1/route-reports/{id}/acknowledge"; tag: "Route reports" };
  /** Confirm a route report is fixed (buyer) */
  postRouteReportsByIdConfirm: { method: "POST"; path: "/api/v1/route-reports/{id}/confirm"; tag: "Route reports" };
  /** Escalate a route report to support */
  postRouteReportsByIdEscalate: { method: "POST"; path: "/api/v1/route-reports/{id}/escalate"; tag: "Route reports" };
  /** Reply on a route report */
  postRouteReportsByIdMessages: { method: "POST"; path: "/api/v1/route-reports/{id}/messages"; tag: "Route reports" };
  /** Reopen a resolved route report (buyer) */
  postRouteReportsByIdReopen: { method: "POST"; path: "/api/v1/route-reports/{id}/reopen"; tag: "Route reports" };
  /** Mark a route report resolved (seller) */
  postRouteReportsByIdResolve: { method: "POST"; path: "/api/v1/route-reports/{id}/resolve"; tag: "Route reports" };
  /** List a new route for sale */
  postRoutes: { method: "POST"; path: "/api/v1/routes"; tag: "Marketplace routes" };
  /** Draft a listing from a rate sheet */
  postRoutesAutopilotDraft: { method: "POST"; path: "/api/v1/routes/autopilot/draft"; tag: "Marketplace routes" };
  /** Create a blended route */
  postRoutesBlends: { method: "POST"; path: "/api/v1/routes/blends"; tag: "Route blends" };
  /** Preview a blended route */
  postRoutesBlendsPreview: { method: "POST"; path: "/api/v1/routes/blends/preview"; tag: "Route blends" };
  /** Propose the cheapest complete blend for a destination */
  postRoutesBlendsPropose: { method: "POST"; path: "/api/v1/routes/blends/propose"; tag: "Route blends" };
  /** Collapse per-country listings back into one deck */
  postRoutesByIdCollapseBundle: { method: "POST"; path: "/api/v1/routes/{id}/collapse-bundle"; tag: "Rate sheets" };
  /** Publish an A-Z deck as per-country listings */
  postRoutesByIdPublishByCountry: { method: "POST"; path: "/api/v1/routes/{id}/publish-by-country"; tag: "Rate sheets" };
  /** Withdraw a scheduled rate change */
  postRoutesByIdRateChangesByChangeIdCancel: { method: "POST"; path: "/api/v1/routes/{id}/rate-changes/{changeId}/cancel"; tag: "Rate sheets" };
  /** Schedule a price change on a one-price route */
  postRoutesByIdRateChangesFlat: { method: "POST"; path: "/api/v1/routes/{id}/rate-changes/flat"; tag: "Rate sheets" };
  /** Add a rate to your route's deck */
  postRoutesByIdRates: { method: "POST"; path: "/api/v1/routes/{id}/rates"; tag: "Rate sheets" };
  /** Add many rates to your route's deck */
  postRoutesByIdRatesBulk: { method: "POST"; path: "/api/v1/routes/{id}/rates/bulk"; tag: "Rate sheets" };
  /** Upload a rate sheet to a route */
  postRoutesByIdRateSheets: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets"; tag: "Rate sheets" };
  /** Apply a rate-sheet import */
  postRoutesByIdRateSheetsByImportIdApply: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets/{importId}/apply"; tag: "Rate sheets" };
  /** Compare a rate-sheet import with the live deck */
  postRoutesByIdRateSheetsByImportIdDiff: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets/{importId}/diff"; tag: "Rate sheets" };
  /** Preview a rate-sheet import */
  postRoutesByIdRateSheetsByImportIdPreview: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets/{importId}/preview"; tag: "Rate sheets" };
  /** Reapply a rate-sheet import with new settings */
  postRoutesByIdRateSheetsByImportIdReapply: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets/{importId}/reapply"; tag: "Rate sheets" };
  /** Roll a route back to an earlier rate-sheet import */
  postRoutesByIdRateSheetsByImportIdRollback: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets/{importId}/rollback"; tag: "Rate sheets" };
  /** Upload and apply a rate sheet in one step */
  postRoutesByIdRateSheetsQuick: { method: "POST"; path: "/api/v1/routes/{id}/rate-sheets/quick"; tag: "Rate sheets" };
  /** Restore a deleted route */
  postRoutesByIdRestore: { method: "POST"; path: "/api/v1/routes/{id}/restore"; tag: "Marketplace routes" };
  /** Classify a sample transcript with call screening */
  postRoutesByIdScreeningTest: { method: "POST"; path: "/api/v1/routes/{id}/screening/test"; tag: "Marketplace routes" };
  /** Capture a SIP trace of a test call on a route */
  postRoutesByIdSipTrace: { method: "POST"; path: "/api/v1/routes/{id}/sip-trace"; tag: "Marketplace routes" };
  /** Test connectivity to your route endpoint */
  postRoutesByIdTest: { method: "POST"; path: "/api/v1/routes/{id}/test"; tag: "Marketplace routes" };
  /** Set one SIP endpoint on many of your voice routes */
  postRoutesMyBulkSipEndpoint: { method: "POST"; path: "/api/v1/routes/my/bulk-sip-endpoint"; tag: "Marketplace routes" };
  /** Set one SMS delivery method on many of your SMS routes */
  postRoutesMyBulkSmsDelivery: { method: "POST"; path: "/api/v1/routes/my/bulk-sms-delivery"; tag: "Marketplace routes" };
  /** Save a SIP endpoint */
  postRoutesMyEndpoints: { method: "POST"; path: "/api/v1/routes/my-endpoints"; tag: "Marketplace routes" };
  /** Test an endpoint before listing a route */
  postRoutesProbeEndpoint: { method: "POST"; path: "/api/v1/routes/probe-endpoint"; tag: "Marketplace routes" };
  /** Set one delivery endpoint on all your endpoint-less SMS routes */
  postRoutesSmsEndpointBulk: { method: "POST"; path: "/api/v1/routes/sms-endpoint/bulk"; tag: "Marketplace routes" };
  /** Subscribe an email address to status updates */
  postStatusSubscribe: { method: "POST"; path: "/api/v1/status/subscribe"; tag: "Status" };
  /** Unsubscribe from status updates in one click */
  postStatusUnsubscribe: { method: "POST"; path: "/api/v1/status/unsubscribe"; tag: "Status" };
  /** Contact support without an account */
  postSupportTickets: { method: "POST"; path: "/api/v1/support/tickets"; tag: "Support" };
  /** Add an inbound IP ACL entry */
  postSwitchAcls: { method: "POST"; path: "/api/v1/switch/acls"; tag: "Switch: routing" };
  /** Approve or reject an approval request */
  postSwitchApprovalsByIdDecide: { method: "POST"; path: "/api/v1/switch/approvals/{id}/decide"; tag: "Switch: team and audit" };
  /** Start a background call-record export */
  postSwitchCdrExports: { method: "POST"; path: "/api/v1/switch/cdr-exports"; tag: "Switch: CDRs and analytics" };
  /** Record that call-record details were copied */
  postSwitchCdrsByIdAuditCopy: { method: "POST"; path: "/api/v1/switch/cdrs/{id}/audit-copy"; tag: "Switch: CDRs and analytics" };
  /** Re-run routing for a call record */
  postSwitchCdrsByIdRetest: { method: "POST"; path: "/api/v1/switch/cdrs/{id}/retest"; tag: "Switch: CDRs and analytics" };
  /** Save a call-record view */
  postSwitchCdrViews: { method: "POST"; path: "/api/v1/switch/cdr-views"; tag: "Switch: CDRs and analytics" };
  /** Create a bilateral counterparty */
  postSwitchCounterparties: { method: "POST"; path: "/api/v1/switch/counterparties"; tag: "Switch: invoicing" };
  /** Run netting for a counterparty over a period */
  postSwitchCounterpartiesByIdNetting: { method: "POST"; path: "/api/v1/switch/counterparties/{id}/netting"; tag: "Switch: invoicing" };
  /** Issue a credit note to a customer */
  postSwitchCreditNotes: { method: "POST"; path: "/api/v1/switch/credit-notes"; tag: "Switch: invoicing" };
  /** Create a Switch customer */
  postSwitchCustomers: { method: "POST"; path: "/api/v1/switch/customers"; tag: "Switch: customers" };
  /** Set a Switch customer billing cycle and payment terms */
  postSwitchCustomersByIdBillingSettings: { method: "POST"; path: "/api/v1/switch/customers/{id}/billing-settings"; tag: "Switch: customers" };
  /** Add a Switch customer contact */
  postSwitchCustomersByIdContacts: { method: "POST"; path: "/api/v1/switch/customers/{id}/contacts"; tag: "Switch: customers" };
  /** Issue the reviewed invoice for a Switch customer */
  postSwitchCustomersByIdGenerateInvoice: { method: "POST"; path: "/api/v1/switch/customers/{id}/generate-invoice"; tag: "Switch: customers" };
  /** Preview an invoice for a Switch customer unbilled period */
  postSwitchCustomersByIdInvoicePreview: { method: "POST"; path: "/api/v1/switch/customers/{id}/invoice-preview"; tag: "Switch: customers" };
  /** Activate, suspend, reactivate, close or reopen a Switch customer */
  postSwitchCustomersByIdLifecycle: { method: "POST"; path: "/api/v1/switch/customers/{id}/lifecycle"; tag: "Switch: customers" };
  /** Add an internal note to a Switch customer */
  postSwitchCustomersByIdNotes: { method: "POST"; path: "/api/v1/switch/customers/{id}/notes"; tag: "Switch: customers" };
  /** Record a payment received from a Switch customer */
  postSwitchCustomersByIdPayments: { method: "POST"; path: "/api/v1/switch/customers/{id}/payments"; tag: "Switch: customers" };
  /** Reverse a recorded Switch customer payment */
  postSwitchCustomersByIdPaymentsByTransactionIdReverse: { method: "POST"; path: "/api/v1/switch/customers/{id}/payments/{transactionId}/reverse"; tag: "Switch: customers" };
  /** Email a Switch customer a portal sign-in link */
  postSwitchCustomersByIdPortalInvite: { method: "POST"; path: "/api/v1/switch/customers/{id}/portal-invite"; tag: "Switch: customers" };
  /** Assign routing to a Switch customer */
  postSwitchCustomersByIdRouting: { method: "POST"; path: "/api/v1/switch/customers/{id}/routing"; tag: "Switch: customers" };
  /** Add or replace one Switch customer sell rate */
  postSwitchCustomersByIdSellRates: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates"; tag: "Switch: customers" };
  /** Reprice a Switch customer deck as a markup over buy cost */
  postSwitchCustomersByIdSellRatesApplyMarkup: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/apply-markup"; tag: "Switch: customers" };
  /** Add or replace many Switch customer sell rates */
  postSwitchCustomersByIdSellRatesBulk: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/bulk"; tag: "Switch: customers" };
  /** Discontinue one Switch customer sell rate */
  postSwitchCustomersByIdSellRatesByRateIdDiscontinue: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/{rateId}/discontinue"; tag: "Switch: customers" };
  /** Discontinue every Switch customer sell rate now */
  postSwitchCustomersByIdSellRatesClear: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/clear"; tag: "Switch: customers" };
  /** Discontinue a Switch customer whole sell deck */
  postSwitchCustomersByIdSellRatesDiscontinueAll: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/discontinue-all"; tag: "Switch: customers" };
  /** Preview discontinuing a Switch customer whole sell deck */
  postSwitchCustomersByIdSellRatesDiscontinueAllPreview: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/discontinue-all/preview"; tag: "Switch: customers" };
  /** Email a Switch customer a rate-change notice */
  postSwitchCustomersByIdSellRatesNoticeSend: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/notice/send"; tag: "Switch: customers" };
  /** Schedule a future Switch customer sell-rate change */
  postSwitchCustomersByIdSellRatesSchedule: { method: "POST"; path: "/api/v1/switch/customers/{id}/sell-rates/schedule"; tag: "Switch: customers" };
  /** Rotate a Switch customer inbound SIP password */
  postSwitchCustomersByIdSipPassword: { method: "POST"; path: "/api/v1/switch/customers/{id}/sip-password"; tag: "Switch: customers" };
  /** Add a trunk to a Switch customer */
  postSwitchCustomersByIdTrunks: { method: "POST"; path: "/api/v1/switch/customers/{id}/trunks"; tag: "Switch: customers" };
  /** Preview an address before allowing it on a trunk */
  postSwitchCustomerTrunksByTrunkIdAddressesPreview: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/addresses/preview"; tag: "Switch: customer trunks" };
  /** Archive a Switch customer trunk */
  postSwitchCustomerTrunksByTrunkIdArchive: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/archive"; tag: "Switch: customer trunks" };
  /** Clone a Switch customer trunk */
  postSwitchCustomerTrunksByTrunkIdClone: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/clone"; tag: "Switch: customer trunks" };
  /** Record that a trunk credential was copied */
  postSwitchCustomerTrunksByTrunkIdCredentialsCopied: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/credentials/copied"; tag: "Switch: customer trunks" };
  /** Allow a source address on a trunk */
  postSwitchCustomerTrunksByTrunkIdIps: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/ips"; tag: "Switch: customer trunks" };
  /** Add or replace one sell rate on a trunk */
  postSwitchCustomerTrunksByTrunkIdRates: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates"; tag: "Switch: customer trunks" };
  /** Reprice as a markup over buy cost from a trunk */
  postSwitchCustomerTrunksByTrunkIdRatesApplyMarkup: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/apply-markup"; tag: "Switch: customer trunks" };
  /** Add or replace many sell rates on a trunk */
  postSwitchCustomerTrunksByTrunkIdRatesBulk: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/bulk"; tag: "Switch: customer trunks" };
  /** Discontinue one sell rate on a trunk */
  postSwitchCustomerTrunksByTrunkIdRatesByRateIdDiscontinue: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/{rateId}/discontinue"; tag: "Switch: customer trunks" };
  /** Discontinue every sell rate on a trunk now */
  postSwitchCustomerTrunksByTrunkIdRatesClear: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/clear"; tag: "Switch: customer trunks" };
  /** Discontinue a trunk's whole sell deck */
  postSwitchCustomerTrunksByTrunkIdRatesDiscontinueAll: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/discontinue-all"; tag: "Switch: customer trunks" };
  /** Preview discontinuing a trunk's whole sell deck */
  postSwitchCustomerTrunksByTrunkIdRatesDiscontinueAllPreview: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/discontinue-all/preview"; tag: "Switch: customer trunks" };
  /** Schedule a future sell-rate change on a trunk */
  postSwitchCustomerTrunksByTrunkIdRatesSchedule: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/rates/schedule"; tag: "Switch: customer trunks" };
  /** Restore an archived Switch customer trunk */
  postSwitchCustomerTrunksByTrunkIdRestore: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/restore"; tag: "Switch: customer trunks" };
  /** Set routing on a Switch customer trunk */
  postSwitchCustomerTrunksByTrunkIdRouting: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/routing"; tag: "Switch: customer trunks" };
  /** Replace a Switch customer trunk's SIP password */
  postSwitchCustomerTrunksByTrunkIdSipPassword: { method: "POST"; path: "/api/v1/switch/customer-trunks/{trunkId}/sip-password"; tag: "Switch: customer trunks" };
  /** Test a caller-ID rewrite rule against a sample number */
  postSwitchCustomerTrunksCliRewritePreview: { method: "POST"; path: "/api/v1/switch/customer-trunks/cli-rewrite/preview"; tag: "Switch: customer trunks" };
  /** Create a dialplan */
  postSwitchDialplans: { method: "POST"; path: "/api/v1/switch/dialplans"; tag: "Switch: routing" };
  /** Clone a dialplan with all its rules */
  postSwitchDialplansByIdClone: { method: "POST"; path: "/api/v1/switch/dialplans/{id}/clone"; tag: "Switch: routing" };
  /** Add numbers to your Do Not Call list from a file */
  postSwitchDncImport: { method: "POST"; path: "/api/v1/switch/dnc/import"; tag: "Switch: operations" };
  /** Remove Do Not Call numbers from an uploaded list */
  postSwitchDncScrub: { method: "POST"; path: "/api/v1/switch/dnc/scrub"; tag: "Switch: operations" };
  /** Retrain the traffic baseline from recent calls */
  postSwitchFraudRetrain: { method: "POST"; path: "/api/v1/switch/fraud/retrain"; tag: "Switch: operations" };
  /** Score the risk of a call without placing it */
  postSwitchFraudScore: { method: "POST"; path: "/api/v1/switch/fraud/score"; tag: "Switch: operations" };
  /** Update fraud screening settings */
  postSwitchFraudSettings: { method: "POST"; path: "/api/v1/switch/fraud/settings"; tag: "Switch: operations" };
  /** Issue an invoice from a reviewed preview */
  postSwitchInvoices: { method: "POST"; path: "/api/v1/switch/invoices"; tag: "Switch: invoicing" };
  /** Record a payment received against an invoice */
  postSwitchInvoicesByIdPayments: { method: "POST"; path: "/api/v1/switch/invoices/{id}/payments"; tag: "Switch: invoicing" };
  /** Void an invoice and issue its replacement */
  postSwitchInvoicesByIdReissue: { method: "POST"; path: "/api/v1/switch/invoices/{id}/reissue"; tag: "Switch: invoicing" };
  /** Email an invoice to its recipients */
  postSwitchInvoicesByIdSend: { method: "POST"; path: "/api/v1/switch/invoices/{id}/send"; tag: "Switch: invoicing" };
  /** Void an invoice */
  postSwitchInvoicesByIdVoid: { method: "POST"; path: "/api/v1/switch/invoices/{id}/void"; tag: "Switch: invoicing" };
  /** Preview an invoice before issuing it */
  postSwitchInvoicesPreview: { method: "POST"; path: "/api/v1/switch/invoices/preview"; tag: "Switch: invoicing" };
  /** Acknowledge an operational issue */
  postSwitchIssuesByRefAcknowledge: { method: "POST"; path: "/api/v1/switch/issues/{ref}/acknowledge"; tag: "Switch: operations" };
  /** Assign an operational issue to a team member */
  postSwitchIssuesByRefAssign: { method: "POST"; path: "/api/v1/switch/issues/{ref}/assign"; tag: "Switch: operations" };
  /** Dismiss an operational issue */
  postSwitchIssuesByRefDismiss: { method: "POST"; path: "/api/v1/switch/issues/{ref}/dismiss"; tag: "Switch: operations" };
  /** Reopen a resolved or dismissed operational issue */
  postSwitchIssuesByRefReopen: { method: "POST"; path: "/api/v1/switch/issues/{ref}/reopen"; tag: "Switch: operations" };
  /** Resolve an operational issue */
  postSwitchIssuesByRefResolve: { method: "POST"; path: "/api/v1/switch/issues/{ref}/resolve"; tag: "Switch: operations" };
  /** Snooze notifications for an operational issue */
  postSwitchIssuesByRefSnooze: { method: "POST"; path: "/api/v1/switch/issues/{ref}/snooze"; tag: "Switch: operations" };
  /** Ask AI Control a question about your switch */
  postSwitchNocAsk: { method: "POST"; path: "/api/v1/switch/noc/ask"; tag: "Switch: operations" };
  /** Raise a payable for a supplier trunk over a period */
  postSwitchPayables: { method: "POST"; path: "/api/v1/switch/payables"; tag: "Switch: invoicing" };
  /** Record a payment made to a supplier */
  postSwitchPayablesByIdPayments: { method: "POST"; path: "/api/v1/switch/payables/{id}/payments"; tag: "Switch: invoicing" };
  /** Void a payable */
  postSwitchPayablesByIdVoid: { method: "POST"; path: "/api/v1/switch/payables/{id}/void"; tag: "Switch: invoicing" };
  /** Create a provider */
  postSwitchProviders: { method: "POST"; path: "/api/v1/switch/providers"; tag: "Switch: suppliers" };
  /** Add a provider contact */
  postSwitchProvidersByIdContacts: { method: "POST"; path: "/api/v1/switch/providers/{id}/contacts"; tag: "Switch: suppliers" };
  /** Open a billing dispute with a provider */
  postSwitchProvidersByIdDisputes: { method: "POST"; path: "/api/v1/switch/providers/{id}/disputes"; tag: "Switch: suppliers" };
  /** Change a provider lifecycle status */
  postSwitchProvidersByIdStatus: { method: "POST"; path: "/api/v1/switch/providers/{id}/status"; tag: "Switch: suppliers" };
  /** Create a supplier rate deck */
  postSwitchRateDecks: { method: "POST"; path: "/api/v1/switch/rate-decks"; tag: "Switch: rating" };
  /** Apply a rate sheet to a switch deck */
  postSwitchRateDecksApply: { method: "POST"; path: "/api/v1/switch/rate-decks/apply"; tag: "Switch: rating" };
  /** Activate a rate deck */
  postSwitchRateDecksByIdActivate: { method: "POST"; path: "/api/v1/switch/rate-decks/{id}/activate"; tag: "Switch: rating" };
  /** Approve a rate deck, now or from a future date */
  postSwitchRateDecksByIdApprove: { method: "POST"; path: "/api/v1/switch/rate-decks/{id}/approve"; tag: "Switch: rating" };
  /** Roll back an active rate deck */
  postSwitchRateDecksByIdRollback: { method: "POST"; path: "/api/v1/switch/rate-decks/{id}/rollback"; tag: "Switch: rating" };
  /** Submit a rate deck for approval */
  postSwitchRateDecksByIdSubmit: { method: "POST"; path: "/api/v1/switch/rate-decks/{id}/submit"; tag: "Switch: rating" };
  /** Validate a rate deck */
  postSwitchRateDecksByIdValidate: { method: "POST"; path: "/api/v1/switch/rate-decks/{id}/validate"; tag: "Switch: rating" };
  /** Open a new draft version of a rate deck */
  postSwitchRateDecksByIdVersions: { method: "POST"; path: "/api/v1/switch/rate-decks/{id}/versions"; tag: "Switch: rating" };
  /** Preview what a rate sheet would change */
  postSwitchRateDecksDiff: { method: "POST"; path: "/api/v1/switch/rate-decks/diff"; tag: "Switch: rating" };
  /** Read a rate sheet and propose a column mapping */
  postSwitchRateDecksParse: { method: "POST"; path: "/api/v1/switch/rate-decks/parse"; tag: "Switch: rating" };
  /** Create a route group */
  postSwitchRoutePlans: { method: "POST"; path: "/api/v1/switch/route-plans"; tag: "Switch: routing" };
  /** Clone a route group with all its suppliers */
  postSwitchRoutePlansByIdClone: { method: "POST"; path: "/api/v1/switch/route-plans/{id}/clone"; tag: "Switch: routing" };
  /** Run a route trace for a number */
  postSwitchRoutingTrace: { method: "POST"; path: "/api/v1/switch/routing/trace"; tag: "Switch: routing" };
  /** Save a route trace */
  postSwitchRoutingTraces: { method: "POST"; path: "/api/v1/switch/routing/traces"; tag: "Switch: routing" };
  /** Create a sell deck */
  postSwitchSellDecks: { method: "POST"; path: "/api/v1/switch/sell-decks"; tag: "Switch: rating" };
  /** Publish a sell deck (preview first, then confirm) */
  postSwitchSellDecksByDeckIdPublish: { method: "POST"; path: "/api/v1/switch/sell-decks/{deckId}/publish"; tag: "Switch: rating" };
  /** Replace the prices in a draft sell deck */
  postSwitchSellDecksByDeckIdRates: { method: "POST"; path: "/api/v1/switch/sell-decks/{deckId}/rates"; tag: "Switch: rating" };
  /** Open a new draft version of a sell deck */
  postSwitchSellDecksByDeckIdVersions: { method: "POST"; path: "/api/v1/switch/sell-decks/{deckId}/versions"; tag: "Switch: rating" };
  /** Set or clear the system default sell deck */
  postSwitchSellDecksSystemDefault: { method: "POST"; path: "/api/v1/switch/sell-decks/system-default"; tag: "Switch: rating" };
  /** Add or update one operator sell rate */
  postSwitchSellRates: { method: "POST"; path: "/api/v1/switch/sell-rates"; tag: "Switch: rating" };
  /** Add or update operator sell rates in bulk */
  postSwitchSellRatesBulk: { method: "POST"; path: "/api/v1/switch/sell-rates/bulk"; tag: "Switch: rating" };
  /** Clear operator sell rates */
  postSwitchSellRatesClear: { method: "POST"; path: "/api/v1/switch/sell-rates/clear"; tag: "Switch: rating" };
  /** Create a provider */
  postSwitchSupplierAccounts: { method: "POST"; path: "/api/v1/switch/supplier-accounts"; tag: "Switch: suppliers" };
  /** Add a provider contact */
  postSwitchSupplierAccountsByIdContacts: { method: "POST"; path: "/api/v1/switch/supplier-accounts/{id}/contacts"; tag: "Switch: suppliers" };
  /** Change a provider lifecycle status */
  postSwitchSupplierAccountsByIdStatus: { method: "POST"; path: "/api/v1/switch/supplier-accounts/{id}/status"; tag: "Switch: suppliers" };
  /** Create a supplier trunk */
  postSwitchSuppliers: { method: "POST"; path: "/api/v1/switch/suppliers"; tag: "Switch: suppliers" };
  /** Move a supplier trunk to another provider */
  postSwitchSuppliersByIdAssignAccount: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/assign-account"; tag: "Switch: suppliers" };
  /** Add a SIP endpoint to a supplier trunk */
  postSwitchSuppliersByIdEndpoints: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/endpoints"; tag: "Switch: suppliers" };
  /** Email a supplier portal sign-in link */
  postSwitchSuppliersByIdPortalInvite: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/portal-invite"; tag: "Switch: suppliers" };
  /** Set the cost for one prefix on a supplier trunk */
  postSwitchSuppliersByIdRates: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/rates"; tag: "Switch: suppliers" };
  /** Set costs for many prefixes on a supplier trunk */
  postSwitchSuppliersByIdRatesBulk: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/rates/bulk"; tag: "Switch: suppliers" };
  /** Clear the cost deck of a supplier trunk */
  postSwitchSuppliersByIdRatesClear: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/rates/clear"; tag: "Switch: suppliers" };
  /** Restore an archived cost deck */
  postSwitchSuppliersByIdRatesRestore: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/rates/restore"; tag: "Switch: suppliers" };
  /** Schedule a future cost change for one prefix */
  postSwitchSuppliersByIdRatesSchedule: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/rates/schedule"; tag: "Switch: suppliers" };
  /** Send a test call to a supplier trunk */
  postSwitchSuppliersByIdTestCall: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/test-call"; tag: "Switch: suppliers" };
  /** Test a supplier trunk SMS delivery */
  postSwitchSuppliersByIdTestSms: { method: "POST"; path: "/api/v1/switch/suppliers/{id}/test-sms"; tag: "Switch: suppliers" };
  /** Promote a marketplace purchase to a supplier trunk */
  postSwitchSuppliersPromote: { method: "POST"; path: "/api/v1/switch/suppliers/promote"; tag: "Switch: suppliers" };
  /** Test unsaved SMS delivery details */
  postSwitchSuppliersTestSms: { method: "POST"; path: "/api/v1/switch/suppliers/test-sms"; tag: "Switch: suppliers" };
  /** Add a team member */
  postSwitchTeam: { method: "POST"; path: "/api/v1/switch/team"; tag: "Switch: team and audit" };
  /** Turn supplier trunk change approval on or off */
  postSwitchTrunkApprovalSetting: { method: "POST"; path: "/api/v1/switch/trunk-approval-setting"; tag: "Switch: customer trunks" };
  /** Approve and apply a trunk configuration change */
  postSwitchTrunkChangesByIdApprove: { method: "POST"; path: "/api/v1/switch/trunk-changes/{id}/approve"; tag: "Switch: customer trunks" };
  /** Reject a trunk configuration change */
  postSwitchTrunkChangesByIdReject: { method: "POST"; path: "/api/v1/switch/trunk-changes/{id}/reject"; tag: "Switch: customer trunks" };
  /** Withdraw your own pending trunk change */
  postSwitchTrunkChangesByIdWithdraw: { method: "POST"; path: "/api/v1/switch/trunk-changes/{id}/withdraw"; tag: "Switch: customer trunks" };
  /** Turn the trunk readiness gate on or off */
  postSwitchTrunkReadinessSetting: { method: "POST"; path: "/api/v1/switch/trunk-readiness-setting"; tag: "Switch: customer trunks" };
  /** Open a support ticket */
  postTickets: { method: "POST"; path: "/api/v1/tickets"; tag: "Support" };
  /** Reply to a support ticket */
  postTicketsByIdMessages: { method: "POST"; path: "/api/v1/tickets/{id}/messages"; tag: "Support" };
  /** Start a crypto top-up */
  postTopupsCrypto: { method: "POST"; path: "/api/v1/topups/crypto"; tag: "Top-ups" };
  /** Set your default card */
  postTopupsPaymentMethodsDefault: { method: "POST"; path: "/api/v1/topups/payment-methods/default"; tag: "Top-ups" };
  /** Start saving a card for auto-recharge */
  postTopupsSetupIntent: { method: "POST"; path: "/api/v1/topups/setup-intent"; tag: "Top-ups" };
  /** Start a card top-up */
  postTopupsStripe: { method: "POST"; path: "/api/v1/topups/stripe"; tag: "Top-ups" };
  /** Start a wire-transfer top-up */
  postTopupsWire: { method: "POST"; path: "/api/v1/topups/wire"; tag: "Top-ups" };
  /** Top up with an x402 USDC payment */
  postTopupsX402: { method: "POST"; path: "/api/v1/topups/x402"; tag: "Top-ups" };
  /** Check the code a user entered */
  postVerifyCheck: { method: "POST"; path: "/api/v1/verify/check"; tag: "Verify" };
  /** Send a verification code by SMS or voice call */
  postVerifyStart: { method: "POST"; path: "/api/v1/verify/start"; tag: "Verify" };
  /** Update your account profile */
  putAccount: { method: "PUT"; path: "/api/v1/account"; tag: "Account" };
  /** Update your spend alert settings */
  putAccountAlerts: { method: "PUT"; path: "/api/v1/account/alerts"; tag: "Account" };
  /** Update your Application Manager settings */
  putApplicationSettings: { method: "PUT"; path: "/api/v1/application/settings"; tag: "Application Manager" };
  /** Update a campaign */
  putDialerCampaignsById: { method: "PUT"; path: "/api/v1/dialer/campaigns/{id}"; tag: "Dialer" };
  /** Assign a caller-ID set and rotation strategy to a campaign */
  putDialerCampaignsByIdCli: { method: "PUT"; path: "/api/v1/dialer/campaigns/{id}/cli"; tag: "Dialer" };
  /** Point a number at an AI voice agent */
  putDidsByIdAiAgent: { method: "PUT"; path: "/api/v1/dids/{id}/ai-agent"; tag: "Phone numbers" };
  /** Configure the IVR menu on a number */
  putDidsByIdFeaturesIvr: { method: "PUT"; path: "/api/v1/dids/{id}/features/ivr"; tag: "Phone numbers" };
  /** Configure call recording on a number */
  putDidsByIdFeaturesRecording: { method: "PUT"; path: "/api/v1/dids/{id}/features/recording"; tag: "Phone numbers" };
  /** Configure business-hours routing on a number */
  putDidsByIdFeaturesSchedule: { method: "PUT"; path: "/api/v1/dids/{id}/features/schedule"; tag: "Phone numbers" };
  /** Configure voicemail on a number */
  putDidsByIdFeaturesVoicemail: { method: "PUT"; path: "/api/v1/dids/{id}/features/voicemail"; tag: "Phone numbers" };
  /** Replace a number's call flow */
  putDidsByIdRouting: { method: "PUT"; path: "/api/v1/dids/{id}/routing"; tag: "Phone numbers" };
  /** Update a number's SMS settings */
  putDidsByIdSmsSettings: { method: "PUT"; path: "/api/v1/dids/{id}/sms-settings"; tag: "Phone numbers" };
  /** Update an interconnection */
  putInterconnectionsById: { method: "PUT"; path: "/api/v1/interconnections/{id}"; tag: "Interconnections" };
  /** Set delivery-receipt settings on an SMS interconnection */
  putInterconnectionsByIdDlrConfig: { method: "PUT"; path: "/api/v1/interconnections/{id}/dlr-config"; tag: "Interconnections" };
  /** Replace your voice routing order */
  putPurchasesRoutingOrder: { method: "PUT"; path: "/api/v1/purchases/routing-order"; tag: "Purchases" };
  /** Replace the IVR set on a number you hold */
  putRevshareTakingsByIdIvr: { method: "PUT"; path: "/api/v1/revshare/takings/{id}/ivr"; tag: "Revenue share numbers" };
  /** Update a route you listed */
  putRoutesById: { method: "PUT"; path: "/api/v1/routes/{id}"; tag: "Marketplace routes" };
  /** Save a listing preset */
  putRoutesListingPresets: { method: "PUT"; path: "/api/v1/routes/listing-presets"; tag: "Marketplace routes" };
  /** Set the approval policy for a permission */
  putSwitchApprovalPolicies: { method: "PUT"; path: "/api/v1/switch/approval-policies"; tag: "Switch: team and audit" };
  /** Save your call-records layout */
  putSwitchCdrWorkspace: { method: "PUT"; path: "/api/v1/switch/cdr-workspace"; tag: "Switch: CDRs and analytics" };
  /** Save a Switch customer billing profile */
  putSwitchCustomersByIdBillingProfile: { method: "PUT"; path: "/api/v1/switch/customers/{id}/billing-profile"; tag: "Switch: customers" };
  /** Set a Switch customer default sell deck */
  putSwitchCustomersByIdSellDeck: { method: "PUT"; path: "/api/v1/switch/customers/{id}/sell-deck"; tag: "Switch: customers" };
  /** Set a Switch customer rate-change notice period */
  putSwitchCustomersByIdSellRatesNotice: { method: "PUT"; path: "/api/v1/switch/customers/{id}/sell-rates/notice"; tag: "Switch: customers" };
  /** Assign a sell deck to a trunk */
  putSwitchCustomerTrunksByTrunkIdSellDeck: { method: "PUT"; path: "/api/v1/switch/customer-trunks/{trunkId}/sell-deck"; tag: "Switch: customer trunks" };
  /** Replace the rules in a dialplan */
  putSwitchDialplansByIdRules: { method: "PUT"; path: "/api/v1/switch/dialplans/{id}/rules"; tag: "Switch: routing" };
  /** Set your Switch console mode */
  putSwitchMode: { method: "PUT"; path: "/api/v1/switch/mode"; tag: "Switch" };
  /** Replace the rows of a draft rate deck */
  putSwitchRateDecksByIdRows: { method: "PUT"; path: "/api/v1/switch/rate-decks/{id}/rows"; tag: "Switch: rating" };
  /** Set which supplier trunks a rate deck prices */
  putSwitchRateDecksByIdTrunks: { method: "PUT"; path: "/api/v1/switch/rate-decks/{id}/trunks"; tag: "Switch: rating" };
  /** Replace the suppliers in a route group */
  putSwitchRoutePlansByIdEntries: { method: "PUT"; path: "/api/v1/switch/route-plans/{id}/entries"; tag: "Switch: routing" };
  /** Update your auto-recharge settings */
  putTopupsAutoRecharge: { method: "PUT"; path: "/api/v1/topups/auto-recharge"; tag: "Top-ups" };
  /** Submit or update your US calling compliance profile */
  putUsComplianceProfile: { method: "PUT"; path: "/api/v1/us-compliance/profile"; tag: "Compliance" };
}

export type OperationId = keyof Operations;
