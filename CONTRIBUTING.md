# Contributing

Thank you for helping improve the PacketExchange Node.js SDK. Bug reports, fixes and
documentation improvements are welcome.

## Before you start

- For a bug, open an issue with a minimal reproduction. Remove API keys, webhook secrets,
  phone numbers and other personal data first.
- For a new feature or a change to the public API, open an issue to discuss it before
  sending a pull request.
- Report security vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
- Questions about your account, billing or the API itself go to [support@packetexchange.io](mailto:support@packetexchange.io).

## Development setup

You need Node.js 20 or later.

```bash
git clone https://github.com/PacketExchangeIO/packetexchange-node.git
cd packetexchange-node
npm ci
npm run typecheck
npm run build
npm test
```

The tests run against the built `dist/` output with a mocked `fetch`. They must never call
the live API: it costs money and sends real messages.

## Project layout

| Path | Contents |
| --- | --- |
| `src/client.ts` | The `PacketExchange` client |
| `src/http.ts` | HTTP core: auth, envelope handling, pagination |
| `src/resources/` | One file per resource group |
| `src/webhook-signature.ts` | `verifyWebhookSignature` |
| `src/generated/schemas.ts` | Types generated from `openapi.json` (do not edit by hand) |
| `scripts/generate-types.mjs` | The type generator |
| `dist/` | Built output, committed so GitHub installs need no build |
| `test/` | Tests (Node.js built-in test runner) |

## Making a change

1. Create a branch from `main`.
2. Make your change, following the existing style: small typed methods, one per endpoint,
   each with a short doc comment naming the method and path.
3. Add or update tests in `test/`.
4. If `openapi.json` changed, run `npm run generate`.
5. Run `npm run typecheck && npm run build && npm test`.
6. Commit the rebuilt `dist/` together with the source change. CI fails if `dist/` or
   `src/generated/` is out of date.
7. Add an entry under **Unreleased** in `CHANGELOG.md`.
8. Open a pull request and fill in the template.

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE) and that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).
