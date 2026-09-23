// Public entry point for the packetexchange package.
export { PacketExchange } from './client.js';
export { PacketExchangeError } from './errors.js';
export {
  DEFAULT_BASE_URL,
  HttpClient,
  type PacketExchangeOptions,
  type Envelope,
  type RequestOptions,
  type Page,
} from './http.js';

// Resource classes + their param/result types.
export {
  RoutesResource,
  type RoutingStrategy,
  type ResolveParams,
  type ResolvedRoute,
} from './resources/routes.js';
export {
  CommsResource,
  type CallParams,
  type SmsParams,
  type SmsBulkParams,
  type CommsHistoryFilters,
  type CallResult,
  type SmsResult,
  type VoiceOtpLanguage,
  type VoiceOtpParams,
  type VoiceOtpResult,
  type VoiceOtpStatus,
  type CallAction,
  type CommsCallAccepted,
  type CommsCallStatus,
  type CommsSmsStatus,
  FINAL_CALL_STATUSES,
} from './resources/comms.js';
export { LookupResource } from './resources/lookup.js';
export { NumbersResource, type DidAiAgent } from './resources/numbers.js';
export {
  VerifyResource,
  type VerifyChannel,
  type VerifyLanguage,
  type VerifyStartParams,
  type VerifyStartResult,
  type VerifyCheckParams,
  type VerifyCheckResult,
  type Verification,
} from './resources/verify.js';
export { DialerResource, type DialerAction } from './resources/dialer.js';
export { PurchasesResource, type PurchaseFilters, type ScheduledChangeAcceptance } from './resources/purchases.js';
export { OffersResource, type OfferRole } from './resources/offers.js';
export {
  BillingResource,
  type TransactionFilters,
  type CdrFilters,
} from './resources/billing.js';
export { AccountResource } from './resources/account.js';
export {
  WebhooksResource,
  type WebhookEvent,
  type WebhookCreateInput,
  type WebhookUpdateInput,
  type WebhookDeliveryStatus,
  type WebhookDeliveryFilters,
  type WebhookDeliveryDetail,
} from './resources/webhooks.js';

// Webhook receivers: verify X-PX-Signature (timestamped) with the legacy fallback.
export {
  verifyWebhookSignature,
  type VerifyWebhookSignatureParams,
  type VerifyWebhookSignatureResult,
  type HeaderSource,
} from './webhook-signature.js';

// Types generated from openapi.json. Exposed as a namespace so a spec schema never
// collides with a hand-written export of the same name (both define ApiKey, for example):
// import type { Schemas } from 'packetexchange'.
export type * as Schemas from './generated/schemas.js';
export type { Operations, OperationId } from './generated/schemas.js';
export type {
  Money,
  Webhook,
  WebhookWithSecret,
  WebhookDelivery,
  ApiUsage,
  ValidationIssue,
  ErrorEnvelope,
  PriceNumberResult,
  PricedRoute,
  NumberLookup,
  SmsTimelineStep,
  RoutingOrderEntry,
  RoutingOrderResult,
  RouteForResult,
  RouteForCandidate,
  PurchaseUpcomingRateChanges,
  RouteTestBatch,
  RouteTestItem,
  RouteTestPreview,
} from './generated/schemas.js';
export { CliTestsResource, type RouteTestBatchInput } from './resources/cli-tests.js';
export {
  InterconnectionsResource,
  type InterconnectionTestType,
  type TestConnectionParams,
} from './resources/interconnections.js';
export {
  NotificationsResource,
  DncResource,
  FavoritesResource,
  SavedSearchesResource,
} from './resources/misc.js';

// Re-export the shared domain types so consumers get them from one place.
export type {
  Route,
  RouteCreateInput,
  RouteUpdateInput,
  RouteFilterInput,
  Purchase,
  PurchaseWithRoute,
  DialerCampaign,
  DialerNumber,
  DialerCli,
  ApiKey,
  ApiKeyCreateResult,
  User,
} from './shared-types.js';
