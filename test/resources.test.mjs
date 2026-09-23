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

test('lookup.number encodes the number into the path', async () => {
  const data = { input: '+447700900123', valid: true, e164: '+447700900123', numberType: 'mobile' };
  const { px, calls } = mockClient(() => ({ body: { success: true, data } }));
  const res = await px.lookup.number(' +447700900123 ');
  assert.equal(res.numberType, 'mobile');
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, '/api/v1/lookup/%2B447700900123');
});

test('comms.call sends actions and language unchanged', async () => {
  const { px, calls } = mockClient();
  const actions = [{ say: 'Your order has shipped.' }, { pause: 1 }, { hangup: true }];
  await px.comms.call({ to: '+447700900123', from: '+14155550100', actions, language: 'fr' });
  assert.deepEqual([calls[0].method, calls[0].path], ['POST', '/api/v1/comms/calls']);
  assert.deepEqual(calls[0].body, { to: '+447700900123', from: '+14155550100', actions, language: 'fr' });
});

test('comms.callAsync sets async: true and returns the accepted call', async () => {
  const accepted = {
    callId: 'c1',
    status: 'ringing',
    mode: 'async',
    to: '+447700900123',
    from: '+14155550100',
    actions: 2,
    statusUrl: '/api/v1/comms/calls/c1',
  };
  const { px, calls } = mockClient(() => ({ status: 202, body: { success: true, data: accepted } }));
  const actions = [{ say: 'Press 1 to confirm.' }, { gather: { digits: 1, timeout: 5 } }];
  const res = await px.comms.callAsync(
    { to: '+447700900123', from: '+14155550100', actions },
    { idempotencyKey: 'call-1' },
  );
  assert.equal(res.callId, 'c1');
  assert.equal(res.status, 'ringing');
  assert.deepEqual(calls[0].body, { to: '+447700900123', from: '+14155550100', actions, async: true });
  assert.equal(calls[0].headers['X-Idempotency-Key'], 'call-1');
});

test('comms.waitForCall polls getCall until a final status', async () => {
  const states = ['ringing', 'answered', 'completed'];
  let n = 0;
  const { px, calls } = mockClient(() => {
    const status = states[Math.min(n++, states.length - 1)];
    const gathered = status === 'completed' ? [{ index: 0, digits: '1', status: 'received' }] : null;
    return { body: { success: true, data: { callId: 'c1', status, gathered } } };
  });
  const done = await px.comms.waitForCall('c1', { intervalMs: 1000, timeoutMs: 10_000 });
  assert.equal(done.status, 'completed');
  assert.equal(done.gathered?.[0]?.digits, '1');
  assert.equal(calls.length, 3);
  assert.ok(calls.every((c) => c.method === 'GET' && c.path === '/api/v1/comms/calls/c1'));
});

test('comms.waitForCall returns the last status when the timeout passes', async () => {
  const { px, calls } = mockClient(() => ({ body: { success: true, data: { callId: 'c1', status: 'ringing' } } }));
  const res = await px.comms.waitForCall('c1', { timeoutMs: 0 });
  assert.equal(res.status, 'ringing');
  assert.equal(calls.length, 1);
});

test('comms.getSms returns the delivery timeline', async () => {
  const data = {
    messageId: 'm1',
    status: 'delivered',
    timeline: [
      { status: 'queued', at: '2026-09-23T10:00:00.000Z', source: 'platform' },
      { status: 'sent', at: '2026-09-23T10:00:01.000Z', source: 'submit' },
      { status: 'delivered', at: '2026-09-23T10:00:04.000Z', source: 'carrier_receipt', carrierStatus: 'DELIVRD' },
    ],
    awaitingReceipt: false,
  };
  const { px, calls } = mockClient(() => ({ body: { success: true, data } }));
  const res = await px.comms.getSms('m1');
  assert.deepEqual([calls[0].method, calls[0].path], ['GET', '/api/v1/comms/sms/m1']);
  assert.deepEqual(res.timeline.map((s) => s.status), ['queued', 'sent', 'delivered']);
});

test('numbers AI agent methods use the documented method and path', async () => {
  const { px, calls } = mockClient();
  await px.numbers.getAiAgent('d1');
  await px.numbers.setAiAgent('d1', 'a1');
  await px.numbers.setAiAgent('d1', null);
  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/dids/d1/ai-agent'],
    ['PUT', '/api/v1/dids/d1/ai-agent'],
    ['PUT', '/api/v1/dids/d1/ai-agent'],
  ]);
  assert.deepEqual(calls[1].body, { agentId: 'a1' });
  assert.deepEqual(calls[2].body, { agentId: null });
});

test('webhooks.create sends the new SMS delivery events', async () => {
  const { px, calls } = mockClient();
  await px.webhooks.create({ url: 'https://example.com/hooks', events: ['sms.delivered', 'sms.failed', 'call.gathered'] });
  assert.deepEqual([calls[0].method, calls[0].path], ['POST', '/api/v1/account/webhooks']);
  assert.deepEqual(calls[0].body.events, ['sms.delivered', 'sms.failed', 'call.gathered']);
});
