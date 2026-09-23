import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mockClient } from './helpers.mjs';

test('verify.start, check and get hit the Verify endpoints', async () => {
  const { px, calls } = mockClient();
  await px.verify.start({ to: '+447700900123', channel: 'voice', brand: 'Acme', expirySeconds: 300 }, { idempotencyKey: 'idem-1' });
  await px.verify.check({ verificationId: 'v1', code: '482913' });
  await px.verify.get('v1');

  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].path, '/api/v1/verify/start');
  assert.deepEqual(calls[0].body, { to: '+447700900123', channel: 'voice', brand: 'Acme', expirySeconds: 300 });
  assert.equal(calls[0].headers['X-Idempotency-Key'], 'idem-1');
  assert.equal(calls[1].path, '/api/v1/verify/check');
  assert.deepEqual(calls[1].body, { verificationId: 'v1', code: '482913' });
  assert.deepEqual([calls[2].method, calls[2].path], ['GET', '/api/v1/verify/v1']);
});

test('comms.voiceOtp and getVoiceOtp hit the voice passcode endpoints', async () => {
  const { px, calls } = mockClient();
  await px.comms.voiceOtp({ to: '+447700900123', code: '4829', language: 'es', repeat: 3 });
  await px.comms.getVoiceOtp('o1');
  assert.deepEqual([calls[0].method, calls[0].path], ['POST', '/api/v1/comms/voice-otp']);
  assert.deepEqual(calls[0].body, { to: '+447700900123', code: '4829', language: 'es', repeat: 3 });
  assert.deepEqual([calls[1].method, calls[1].path], ['GET', '/api/v1/comms/voice-otp/o1']);
});

test('routes.priceNumber sends the number and type as query parameters', async () => {
  const { px, calls } = mockClient(() => ({ body: { success: true, data: { number: '447700900123', routes: [], total: 0 } } }));
  const res = await px.routes.priceNumber({ number: '+447700900123', type: 'sms' });
  assert.equal(res.total, 0);
  assert.deepEqual([calls[0].method, calls[0].path], ['GET', '/api/v1/routes/price-number']);
  assert.deepEqual(calls[0].query, { number: '+447700900123', type: 'sms' });
});

test('purchases routing order methods use the documented method and path', async () => {
  const { px, calls } = mockClient();
  await px.purchases.routingOrder();
  await px.purchases.setRoutingOrder(['p1', 'p2']);
  await px.purchases.setRoutingPriority('p1', 1);
  await px.purchases.setRoutingPriority('p2', null);
  await px.purchases.routeFor('+447700900123');
  await px.purchases.upcomingRateChanges('p1');
  await px.purchases.acceptRate('p1', { changeId: 'c1' });

  const sent = calls.map((c) => [c.method, c.path]);
  assert.deepEqual(sent, [
    ['GET', '/api/v1/purchases/routing-order'],
    ['PUT', '/api/v1/purchases/routing-order'],
    ['PATCH', '/api/v1/purchases/p1/routing-priority'],
    ['PATCH', '/api/v1/purchases/p2/routing-priority'],
    ['GET', '/api/v1/purchases/route-for'],
    ['GET', '/api/v1/purchases/p1/upcoming-rate-changes'],
    ['POST', '/api/v1/purchases/p1/accept-rate'],
  ]);
  assert.deepEqual(calls[1].body, { purchaseIds: ['p1', 'p2'] });
  assert.deepEqual(calls[2].body, { priority: 1 });
  assert.deepEqual(calls[3].body, { priority: null });
  assert.deepEqual(calls[4].query, { to: '+447700900123' });
  assert.deepEqual(calls[6].body, { changeId: 'c1' });
});

test('cliTests batch methods use the documented method and path', async () => {
  const { px, calls } = mockClient();
  await px.cliTests.previewBatch(['r1', 'r2']);
  await px.cliTests.createBatch({ routeIds: ['r1', 'r2'], searchLabel: 'UK mobile', displayCli: '+447700900123' });
  await px.cliTests.listBatches({ limit: 5 });
  await px.cliTests.getBatch('b1');
  await px.cliTests.cancelBatch('b1');

  const sent = calls.map((c) => [c.method, c.path]);
  assert.deepEqual(sent, [
    ['POST', '/api/v1/cli-tests/batches/preview'],
    ['POST', '/api/v1/cli-tests/batches'],
    ['GET', '/api/v1/cli-tests/batches'],
    ['GET', '/api/v1/cli-tests/batches/b1'],
    ['POST', '/api/v1/cli-tests/batches/b1/cancel'],
  ]);
  assert.deepEqual(calls[0].body, { routeIds: ['r1', 'r2'] });
  assert.deepEqual(calls[1].body, { routeIds: ['r1', 'r2'], searchLabel: 'UK mobile', displayCli: '+447700900123' });
  assert.deepEqual(calls[2].query, { limit: '5' });
});

test('path segments are percent-encoded', async () => {
  const { px, calls } = mockClient();
  await px.verify.get('a/b');
  assert.equal(calls[0].path, '/api/v1/verify/a%2Fb');
});
