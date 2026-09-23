# Changelog

All notable changes to `@packetexchange/sdk` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the major version is 0, a minor release may contain breaking type changes;
each one is listed under **Changed** or **Fixed**.

## [Unreleased]

### Fixed

- `verifyWebhookSignature` accepts only a digits-only `X-PX-Timestamp` and signs the
  header text exactly as received.
- `CliType` includes `local_cli` and `mixed_cli`, and `RouteQualityType` is
  `'direct' | 'premium' | 'standard' | 'ncli'`, matching the API.
- A failed `requestRaw` call (CSV exports) now carries the API's `details` on the
  `PacketExchangeError`, like every other method.

## [0.3.1] - 2026-09-23

### Added

- `verify` resource for the Verify API: `verify.start({ to, channel: 'sms' | 'voice', ... })`,
  `verify.check({ verificationId, code })` and `verify.get(id)`. The platform generates
  the code, stores only a keyed hash, and enforces expiry (default 10 minutes), 5
  attempts and single use. Sends are rate limited per number and per account (429
  `RATE_LIMITED`). On a test key nothing is sent and `testCode` is returned so a sandbox
  flow can be completed end to end. Types: `VerifyStartParams`, `VerifyStartResult`,
  `VerifyCheckParams`, `VerifyCheckResult`, `Verification`, `VerifyChannel`,
  `VerifyLanguage`.
- `comms.voiceOtp(params)` for `POST /comms/voice-otp`: calls a number and speaks a
  one-time passcode digit by digit, repeated (default twice), then hangs up. Returns
  once the call is dialled; `comms.getVoiceOtp(id)` returns the outcome and cost.
  Types: `VoiceOtpParams`, `VoiceOtpResult`, `VoiceOtpStatus`, `VoiceOtpLanguage`.
- `verify:write` in the `ApiKeyScope` union.
- The `Schemas` namespace includes the Verify types generated from the spec
  (`VerifyStartResult`, `VerifyCheckResult`, `Verification`, `VoiceOtpResult`,
  `VoiceOtpStatus`) and `Operations` lists the Verify operations.

### Changed

- The SDK is distributed from its own repository, `PacketExchangeIO/packetexchange-node`,
  and installs from GitHub with prebuilt `dist/` output. Source maps are no longer
  emitted.

## [0.3.0] - 2026-09-23

### Added

- `routes.priceNumber({ number, type })` for `GET /routes/price-number`: every
  marketplace route that serves a number, at the rate it would charge for that number
  (longest-prefix rate-sheet row, or the flat price), cheapest first. Returns
  `PriceNumberResult`.
- Routing order on `purchases`: `routingOrder()`, `setRoutingOrder(purchaseIds)`,
  `setRoutingPriority(id, priority | null)` and `routeFor(to)`, which answers "which of
  my routes would carry this number" with the same ranking as the live call path
  (`RouteForResult`).
- `purchases.upcomingRateChanges(id)` for scheduled rate changes on a route you bought,
  and `purchases.acceptRate(id, { acceptedRate, deckVersion, changeId })`; with
  `changeId` it accepts a scheduled change in advance.
- Route liveness tests on `cliTests`: `previewBatch(routeIds)`, `createBatch(input)`,
  `listBatches({ limit })`, `getBatch(id)` and `cancelBatch(id)`, typed as
  `RouteTestPreview` and `RouteTestBatch`.
- Generated types for the new endpoints, exported directly: `PriceNumberResult`,
  `PricedRoute`, `RoutingOrderEntry`, `RoutingOrderResult`, `RouteForResult`,
  `RouteForCandidate`, `PurchaseUpcomingRateChanges`, `RouteTestBatch`, `RouteTestItem`,
  `RouteTestPreview`. The `Schemas` namespace also gains `ListingHealth`,
  `BulkEndpointResult`, `SwitchCustomerRateNotice` and `SwitchCustomerRateChange`.

### Changed

- `openapi.json` and the generated types are refreshed from the API: listing health,
  the bulk SMS delivery and SIP endpoint actions, the Switch rate-change notice
  endpoints, route liveness tests and Switch Do Not Call are all documented with
  request and response schemas.

## [0.2.0] - 2026-09-23

### Added

- `webhooks.listAllDeliveries(filters)` for `GET /account/webhooks/deliveries`:
  deliveries across every endpoint, filterable by `webhookId`, `status` and `event`.
  `webhooks.iterateDeliveries(filters)` walks every page.
- `webhooks.getDelivery(deliveryId)` returns one delivery with its exact payload.
- `webhooks.resendDelivery(deliveryId)` queues a new delivery with the same payload.
- `webhooks.rotateSecret(id)`.
- `verifyWebhookSignature({ secret, rawBody, headers, toleranceSeconds })` checks the
  timestamped `X-PX-Signature: v1=...` over `"<X-PX-Timestamp>.<body>"`, rejects stale
  timestamps (default 5 minutes), and falls back to the legacy `X-Webhook-Signature`
  only when the new headers are absent (`allowLegacy: false` refuses it). WebCrypto
  based: Node 18+, Deno, Bun, edge runtimes and browsers.
- `account.apiUsage({ days, keyId })`: usage for one API key. A bare number is still
  accepted as `days`.
- `PacketExchangeError.requestId`: the `X-Request-Id` (a UUID) of the failed request,
  for support tickets.
- Types generated from the OpenAPI spec: `Schemas` namespace (every
  `components.schemas` entry), `Operations` / `OperationId`, and direct exports of
  `Money`, `Webhook`, `WebhookWithSecret`, `WebhookDelivery`, `ApiUsage`,
  `ValidationIssue` and `ErrorEnvelope`. Regenerate with `npm run generate`.

### Changed

- `ResolvedRoute.price` (from `routes.resolve()`) is now a `string`: a 6-decimal USD
  amount like every other money field (`"0.012500"`). It was a `number`. Parse with
  a decimal library, or `Number()` for display only.
- `WebhookEvent` is derived from the spec's event catalogue and now includes every
  subscribable event (numbers, invoicing, netting, sell and cost rate events, ...).
- Webhook methods return typed `Webhook` / `WebhookDelivery` objects instead of
  `Record<string, unknown>`.

### Fixed

- `ApiKey` matches what the API sends: `keyPrefix`, `label`, `scopes`, `environment`,
  `lastUsedAt`, `createdAt`, `expiresAt` as ISO strings. The old type declared
  `userId` and `revokedAt` (never sent) and `Date` fields.
- `ApiKeyCreateResult` includes `keyPrefix` (same value as `prefix`, now the name used
  by every key response), `scopes`, `environment` and `expiresAt`.

## [0.1.0] - 2026-06-04

### Added

- Initial release of the PacketExchange TypeScript SDK.
- `PacketExchange` client with API-key authentication and configurable base URL.
- Resource clients: routes, comms (voice/SMS), dialer, purchases, offers,
  billing, account, webhooks, CLI tests, interconnections, and misc
  (notifications, DNC, favourites, saved searches).
- Cursor-based pagination helpers and a typed `PacketExchangeError`.
- Dual ESM + CommonJS builds with bundled, dependency-free type declarations.

[Unreleased]: [github.com/PacketExchangeIO/packetexchange-node/compare/v0.3.1...HEAD](https://github.com/PacketExchangeIO/packetexchange-node/compare/v0.3.1...HEAD)
[0.3.1]: [github.com/PacketExchangeIO/packetexchange-node/releases/tag/v0.3.1](https://github.com/PacketExchangeIO/packetexchange-node/releases/tag/v0.3.1)
