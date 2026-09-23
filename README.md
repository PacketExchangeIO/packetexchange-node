<p align="center">
  <img src="assets/logo.png" alt="PacketExchange" width="96" height="96">
</p>

<h1 align="center">PacketExchange Node.js SDK</h1>

<p align="center">Typed TypeScript and JavaScript client for the PacketExchange voice and SMS marketplace API.</p>

<p align="center">
  <a href="https://github.com/PacketExchangeIO/packetexchange-node/actions/workflows/ci.yml"><img src="https://github.com/PacketExchangeIO/packetexchange-node/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/github/package-json/v/PacketExchangeIO/packetexchange-node" alt="Version"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node >= 18">
</p>

Every method maps to one documented endpoint of the PacketExchange REST API
(`https://packetexchange.io/api/v1`), returns typed data and throws a typed error. The
package has no runtime dependencies and works anywhere a global `fetch` exists: Node.js
18+, Bun, Deno and modern browsers.

You need a PacketExchange account with prepaid credit to use the API. Sign up at
[packetexchange.io](https://packetexchange.io), add credit, then create an API key in the
dashboard under **API keys**.

## Installation

The SDK is installed from GitHub:

```bash
npm install github:PacketExchangeIO/packetexchange-node
```

Pin a release tag or commit for reproducible installs, for example
`npm install github:PacketExchangeIO/packetexchange-node#v0.3.1`. The package installs as
`@packetexchange/sdk` and ships prebuilt ESM, CommonJS and type declarations, so no build
step runs on install.

## Quick start

Keep the API key in the environment, never in source:

```bash
export PACKETEXCHANGE_API_KEY=your_api_key
```

```ts
import { PacketExchange, PacketExchangeError } from '@packetexchange/sdk';

const px = new PacketExchange({ apiKey: process.env.PACKETEXCHANGE_API_KEY });

try {
  // 1. Verify a phone number: send a one-time code by SMS (or channel: 'voice').
  const verification = await px.verify.start({ to: '+447700900123', channel: 'sms', brand: 'Acme' });

  // Later, check the code the user typed in.
  const check = await px.verify.check({ verificationId: verification.verificationId, code: '482913' });
  console.log(check.status); // 'approved', 'denied', 'expired' or 'max_attempts'

  // 2. Send a transactional SMS. The idempotency key makes a retry safe.
  const sms = await px.comms.sms(
    { to: '+447700900123', from: 'Acme', body: 'Your order 1042 has shipped.' },
    { idempotencyKey: 'order-1042-shipped' },
  );
  console.log(sms.messageId, sms.status, sms.cost);

  // 3. Price a number: every marketplace route that serves it, cheapest first.
  const priced = await px.routes.priceNumber({ number: '+447700900123', type: 'voice' });
  for (const route of priced.routes) {
    console.log(route.name, route.rate, `USD/${priced.unit}`);
  }
} catch (err) {
  if (err instanceof PacketExchangeError) {
    console.error(err.status, err.code, err.message, err.details, err.requestId);
  } else {
    throw err;
  }
}
```

SMS status is the send-time outcome (for example `accepted` or `failed`), not a handset
delivery receipt. Look a message up later with `px.comms.getSms(messageId)`.

## Verification codes

The Verify API generates a code, sends it, and checks it for you. Only a keyed hash of the
code is stored. Each verification expires (10 minutes by default, configurable with
`expirySeconds`), allows 5 attempts and approves once. Sends are rate limited per number
and per account; a refusal is a `PacketExchangeError` with status 429 and code
`RATE_LIMITED`.

```ts
const v = await px.verify.start({ to: '+447700900123', channel: 'voice', language: 'es' });
const state = await px.verify.get(v.verificationId);
```

If you already generate your own code and only need it spoken on a call, use a voice
passcode call. The call continues after the method returns; read the outcome later.

```ts
const otp = await px.comms.voiceOtp({ to: '+447700900123', code: '482913', brand: 'Acme' });
const outcome = await px.comms.getVoiceOtp(otp.voiceOtpId);
```

Voice codes can be spoken in `en`, `es`, `fr`, `de`, `pt` and `hi`. SMS codes also support
`ar`. Keys need the `verify:write` scope for `verify.*` and `voice:send` for
`comms.voiceOtp`.

## Configuration

```ts
const px = new PacketExchange({
  apiKey: process.env.PACKETEXCHANGE_API_KEY, // sent as `Authorization: Bearer <key>`
  baseUrl: 'https://packetexchange.io/api/v1', // the default
  fetch: customFetch,                          // optional: proxies, tests, other runtimes
  headers: { 'X-Correlation-Id': 'abc' },      // optional: added to every request
});
```

Every request method also accepts per-call options: `idempotencyKey`, `headers`, `query`
and an `AbortSignal` as `signal`.

### Live and test keys

API keys are environment-scoped:

- `wmmn_live_sk_...` places real calls and messages and charges your balance.
- `wmmn_test_sk_...` simulates calls, SMS and dialer runs instead of sending them, and
  charges only the account's test credit. Responses from a test key carry
  `simulated: true`, and `verify.start` returns `testCode` so you can complete a
  verification flow end to end.

Keys can be limited to scopes such as `voice:send`, `sms:send`, `verify:write` and
`routes:read`. A call that needs a scope the key lacks fails with status 403 and a message
naming the missing scope. A few account-management endpoints (API keys, payouts, creating or
editing webhooks) accept only a dashboard session, never an API key.

## Error handling

Every failure throws a `PacketExchangeError`: a non-2xx response, a `success: false`
envelope, or a network error.

| Property | Meaning |
| --- | --- |
| `status` | HTTP status, or `0` when no response arrived |
| `code` | The API error code (`VALIDATION_ERROR`, `INVALID_INPUT`, `FORBIDDEN`, `RATE_LIMITED`, ...), or `HTTP_<status>` / `NETWORK_ERROR` when the body had none |
| `message` | Human-readable explanation |
| `details` | For `VALIDATION_ERROR`, an array of `{ path, message }`, one per failing field |
| `requestId` | The `X-Request-Id` response header. Quote it when you contact support |
| `isAuthError` | `true` for 401 and 403 |
| `isRateLimited` | `true` for 429. Wait for the `Retry-After` seconds, then retry |

The API's error envelope is:

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [{ "path": "to", "message": "Invalid E.164 number" }] } }
```

The full list of error codes is in the [API reference](https://packetexchange.io/api-docs).

## Pagination

List methods return one page as `{ data, nextCursor, hasMore, total? }`. Pass `nextCursor`
back as `cursor`, or let an async iterator follow the cursor for you:

```ts
const page = await px.routes.list({ country: 'GB', type: 'voice', limit: 50 });

for await (const route of px.routes.listAll({ country: 'GB' })) {
  console.log(route.destinationName, route.pricePerUnit);
}
```

## Money

Every amount is a US dollar string with exactly 6 decimal places (`"0.012500"`). Voice
prices are per minute and SMS prices are per message segment. Do arithmetic with a decimal
library and use `Number()` only for display.

## Webhooks

PacketExchange signs every webhook delivery. Verify each one in your receiver with
`verifyWebhookSignature`, passing the request body exactly as received. Parsing and
re-serialising the JSON changes the bytes and breaks the signature.

```ts
import express from 'express';
import { verifyWebhookSignature } from '@packetexchange/sdk';

const app = express();

app.post('/webhooks/packetexchange', express.raw({ type: 'application/json' }), async (req, res) => {
  const result = await verifyWebhookSignature({
    secret: process.env.PACKETEXCHANGE_WEBHOOK_SECRET!,
    rawBody: req.body,       // Buffer, Uint8Array, ArrayBuffer or string
    headers: req.headers,    // a Node header object or a Fetch Headers object
    toleranceSeconds: 300,   // the default: reject deliveries older than 5 minutes
  });
  if (!result.valid) return res.status(400).send(result.reason);

  const event = JSON.parse(req.body.toString('utf8'));
  // Deliveries can repeat (retries and manual resends), so de-duplicate on the event data.
  res.sendStatus(200);
});
```

Each delivery carries two signatures:

| Scheme | Headers | Signed content |
| --- | --- | --- |
| v1 (current) | `X-PX-Timestamp: <unix seconds>`<br>`X-PX-Signature: v1=<hex>` | HMAC-SHA256 of `"<timestamp>.<raw body>"` |
| Legacy | `X-Webhook-Signature: sha256=<hex>` | HMAC-SHA256 of the raw body |

The helper checks v1 whenever either v1 header is present, and rejects timestamps outside
`toleranceSeconds` so a captured delivery cannot be replayed. It falls back to the legacy
signature only when both v1 headers are absent, and never when just one of them was
stripped. Pass `allowLegacy: false` to refuse the legacy scheme entirely. The result is
`{ valid, scheme: 'v1' | 'legacy' | 'none', reason?, timestamp? }`; it resolves rather
than throws for a bad signature. The helper uses WebCrypto (`globalThis.crypto.subtle`),
which is available by default on Node.js 20 and later, Bun, Deno and browsers.

Manage endpoints and inspect or resend deliveries with the `webhooks` resource:

```ts
const failed = await px.webhooks.listAllDeliveries({ status: 'failed', limit: 50 });
for (const d of failed.data) console.log(d.event, d.httpStatus, d.lastError);
```

## Resources

| Property | Covers |
| --- | --- |
| `routes` | Marketplace listing and search, Smart Routing preview, number pricing, your listed routes |
| `purchases` | Buying routes, usage, pause and resume, routing order, rate changes |
| `offers` | Price negotiation on routes |
| `comms` | Single calls and SMS, voice passcode calls, call and SMS history |
| `verify` | One-time code verification by SMS or voice |
| `dialer` | Dialer campaigns, numbers and caller IDs |
| `billing` | Summary, ledger, balance history, CDRs and CSV export |
| `account` | Profile, balance, API keys, spend alerts, API usage, sessions |
| `webhooks` | Webhook endpoints and deliveries |
| `cliTests` | Caller-ID tests and route liveness tests |
| `interconnections` | Connections, health and connectivity tests |
| `notifications`, `dnc`, `favorites`, `savedSearches` | Notifications, your do-not-call list, favourite routes, saved searches |

Listing ASR and ACD figures are stated by the seller, not measured by PacketExchange.

For an endpoint without a convenience method, use the HTTP core directly. It applies the
same authentication and error handling:

```ts
const numbers = await px.http.request('GET', '/dids/mine');
```

## Generated types

Types for every schema in the OpenAPI document are exported under the `Schemas` namespace,
and `Operations` maps each operation ID to its method and path:

```ts
import type { Schemas, OperationId } from '@packetexchange/sdk';

type Delivery = Schemas.WebhookDelivery;
```

They are generated from [`openapi.json`](openapi.json), a copy of the document served at
`https://packetexchange.io/api/v1/docs/json`. To refresh them:

```bash
curl -fsSL https://packetexchange.io/api/v1/docs/json -o openapi.json
npm run generate
npm run typecheck && npm run build && npm test
```

## Development

```bash
npm ci
npm run typecheck
npm run build
npm test
```

The tests run against the built `dist/` output with a mocked `fetch`; they never call the
live API. `dist/` is committed so that installing from GitHub needs no build step. Rebuild
and commit it with every source change; CI fails if it is out of date.

## Versioning

This SDK follows [Semantic Versioning](https://semver.org/). While the major version is
`0`, a minor release may contain breaking type changes; each one is listed in
[CHANGELOG.md](CHANGELOG.md). The API itself is versioned by path (`/api/v1`).

## Links

- Developer overview: [packetexchange.io/developers](https://packetexchange.io/developers)
- API reference: [packetexchange.io/api-docs](https://packetexchange.io/api-docs)
- Support: [support@packetexchange.io](mailto:support@packetexchange.io)
- Security issues: see [SECURITY.md](SECURITY.md)

## License

[MIT](LICENSE)
