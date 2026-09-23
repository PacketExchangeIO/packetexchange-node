import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyWebhookSignature } from '../dist/index.js';

const secret = 'whsec_example';
const body = '{"event":"call.completed","data":{"callId":"c1"}}';
const now = 1_760_000_000;
const hmac = (data) => createHmac('sha256', secret).update(data).digest('hex');
const v1Headers = (ts = now, sig = hmac(`${ts}.${body}`)) => ({ 'x-px-timestamp': String(ts), 'x-px-signature': `v1=${sig}` });

test('accepts a valid v1 signature', async () => {
  const r = await verifyWebhookSignature({ secret, rawBody: body, headers: v1Headers(), now });
  assert.deepEqual(r, { valid: true, scheme: 'v1', timestamp: now });
});

test('accepts v1 from a Fetch Headers object and a byte body', async () => {
  const r = await verifyWebhookSignature({
    secret,
    rawBody: new TextEncoder().encode(body),
    headers: new Headers({ 'X-PX-Timestamp': String(now), 'X-PX-Signature': `v1=${hmac(`${now}.${body}`)}` }),
    now,
  });
  assert.equal(r.valid, true);
});

test('rejects a stale timestamp, a bad timestamp and a mismatch', async () => {
  const stale = await verifyWebhookSignature({ secret, rawBody: body, headers: v1Headers(now - 301), now });
  assert.equal(stale.reason, 'stale_timestamp');
  const bad = await verifyWebhookSignature({ secret, rawBody: body, headers: { 'x-px-timestamp': 'soon', 'x-px-signature': 'v1=00' }, now });
  assert.equal(bad.reason, 'bad_timestamp');
  const exponent = await verifyWebhookSignature({ secret, rawBody: body, headers: v1Headers('1.76e9'), now });
  assert.equal(exponent.reason, 'bad_timestamp');
  const tampered = await verifyWebhookSignature({ secret, rawBody: body + ' ', headers: v1Headers(), now });
  assert.equal(tampered.reason, 'mismatch');
});

test('does not fall back to legacy when only one v1 header is present', async () => {
  const r = await verifyWebhookSignature({
    secret,
    rawBody: body,
    headers: { 'x-px-timestamp': String(now), 'x-webhook-signature': `sha256=${hmac(body)}` },
    now,
  });
  assert.deepEqual(r, { valid: false, scheme: 'v1', reason: 'missing_signature' });
});

test('accepts the legacy signature only when v1 headers are absent and allowed', async () => {
  const headers = { 'X-Webhook-Signature': `sha256=${hmac(body)}` };
  assert.deepEqual(await verifyWebhookSignature({ secret, rawBody: body, headers }), { valid: true, scheme: 'legacy' });
  const refused = await verifyWebhookSignature({ secret, rawBody: body, headers, allowLegacy: false });
  assert.equal(refused.reason, 'legacy_disallowed');
});

test('reports a missing signature', async () => {
  const r = await verifyWebhookSignature({ secret, rawBody: body, headers: {} });
  assert.deepEqual(r, { valid: false, scheme: 'none', reason: 'missing_signature' });
});
