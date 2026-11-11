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

test('routes.checks methods use the documented method, path, query and body', async () => {
  const { px, calls } = mockClient();
  await px.routes.checks.create({ routeIds: ['r1', 'r2'], number: '92', mode: 'network' }, { idempotencyKey: 'chk-1' });
  await px.routes.checks.get('k1');
  await px.routes.checks.list({ limit: 10 });
  await px.routes.checks.coverage({ routeIds: ['r1', 'r2'], number: '92' });
  await px.routes.checks.sendSms({ routeId: 'r3', number: '+447700900123' });
  await px.routes.checks.purchase('k1');

  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['POST', '/api/v1/routes/check'],
    ['GET', '/api/v1/routes/check/k1'],
    ['GET', '/api/v1/routes/checks'],
    ['GET', '/api/v1/routes/check/coverage'],
    ['POST', '/api/v1/routes/check/sms'],
    ['POST', '/api/v1/routes/check/k1/purchase'],
  ]);
  assert.deepEqual(calls[0].body, { routeIds: ['r1', 'r2'], number: '92', mode: 'network' });
  assert.equal(calls[0].headers['X-Idempotency-Key'], 'chk-1');
  assert.deepEqual(calls[2].query, { limit: '10' });
  assert.deepEqual(calls[3].query, { routeIds: 'r1,r2', number: '92' });
  assert.deepEqual(calls[4].body, { routeId: 'r3', number: '+447700900123' });
  assert.equal(calls[5].body, undefined);
});

test('purchases LCR, failover and owned methods use the documented method, path, query and body', async () => {
  const { px, calls } = mockClient();
  await px.purchases.lcr('+447700900123');
  await px.purchases.setLcrOrder([{ purchaseId: 'p1' }, { routeId: 'r1' }]);
  await px.purchases.failover();
  await px.purchases.setFailoverPriceLimit('up_to_10');
  await px.purchases.owned('r1');

  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/purchases/lcr'],
    ['PUT', '/api/v1/purchases/lcr-order'],
    ['GET', '/api/v1/purchases/failover'],
    ['PUT', '/api/v1/purchases/failover/price-limit'],
    ['GET', '/api/v1/purchases/owned/r1'],
  ]);
  assert.deepEqual(calls[0].query, { to: '+447700900123' });
  assert.deepEqual(calls[1].body, { order: [{ purchaseId: 'p1' }, { routeId: 'r1' }] });
  assert.deepEqual(calls[3].body, { priceLimit: 'up_to_10' });
});

test('purchases.owned returns null when the route is not held', async () => {
  const { px } = mockClient(() => ({ body: { success: true, data: null } }));
  assert.equal(await px.purchases.owned('r1'), null);
});

test('cliTests.quote and testCountries use the documented method, path and query', async () => {
  const { px, calls } = mockClient();
  await px.cliTests.quote('r1');
  await px.cliTests.testCountries('r1');
  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/cli-tests/quote'],
    ['GET', '/api/v1/cli-tests/routes/r1/test-countries'],
  ]);
  assert.deepEqual(calls[0].query, { routeId: 'r1' });
});

test('verify list, simulateCall and call-in methods use the documented method, path, query and body', async () => {
  const { px, calls } = mockClient();
  await px.verify.start({ to: '+14155550100', channel: 'call_in', reference: 'user-42' });
  await px.verify.list({ reference: 'user-42', status: 'pending', channel: 'call_in', limit: 10 });
  await px.verify.simulateCall('v1');
  await px.verify.callIn.coverage();
  await px.verify.callIn.listNumbers();
  await px.verify.callIn.addNumber('n1');
  await px.verify.callIn.removeNumber('n1');

  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['POST', '/api/v1/verify/start'],
    ['GET', '/api/v1/verify'],
    ['POST', '/api/v1/verify/v1/simulate-call'],
    ['GET', '/api/v1/verify/call-in/coverage'],
    ['GET', '/api/v1/verify/call-in/numbers'],
    ['POST', '/api/v1/verify/call-in/numbers'],
    ['DELETE', '/api/v1/verify/call-in/numbers/n1'],
  ]);
  assert.deepEqual(calls[0].body, { to: '+14155550100', channel: 'call_in', reference: 'user-42' });
  assert.deepEqual(calls[1].query, { reference: 'user-42', status: 'pending', channel: 'call_in', limit: '10' });
  assert.deepEqual(calls[5].body, { phoneNumberId: 'n1' });
});

test('billing earnings, hold schedule, failure summary and price list info hit their endpoints', async () => {
  const { px, calls } = mockClient();
  await px.billing.earnings({ window: 14 });
  await px.billing.holdSchedule();
  await px.billing.failureSummary({ days: 3 });
  await px.billing.priceListInfo();

  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/billing/earnings'],
    ['GET', '/api/v1/billing/hold-schedule'],
    ['GET', '/api/v1/billing/cdrs/failure-summary'],
    ['GET', '/api/v1/price-list/meta'],
  ]);
  assert.deepEqual(calls[0].query, { window: '14' });
  assert.deepEqual(calls[2].query, { days: '3' });
});

test('billing.priceList and myPriceList return the workbook bytes', async () => {
  const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0xff]);
  const xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const { px, calls } = mockClient(() => ({ body: bytes, headers: { 'content-type': xlsx } }));
  const all = await px.billing.priceList();
  const mine = await px.billing.myPriceList();

  assert.ok(all instanceof Uint8Array);
  assert.deepEqual([...all], [...bytes]);
  assert.deepEqual([...mine], [...bytes]);
  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/price-list.xlsx'],
    ['GET', '/api/v1/price-list/me.xlsx'],
  ]);
});

test('billing.priceList throws the API error when the download is refused', async () => {
  const { px } = mockClient(() => ({
    status: 429,
    body: { success: false, error: { code: 'RATE_LIMITED', message: 'Daily download limit reached' } },
  }));
  await assert.rejects(px.billing.priceList(), (err) => err.status === 429 && err.code === 'RATE_LIMITED');
});

test('account.destinationAlerts methods use the documented method, path and body', async () => {
  const { px, calls } = mockClient();
  await px.account.destinationAlerts.list();
  await px.account.destinationAlerts.create({ country: 'Pakistan', trafficType: 'voice' });
  await px.account.destinationAlerts.delete('a1');
  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/account/destination-alerts'],
    ['POST', '/api/v1/account/destination-alerts'],
    ['DELETE', '/api/v1/account/destination-alerts/a1'],
  ]);
  assert.deepEqual(calls[1].body, { country: 'Pakistan', trafficType: 'voice' });
});

test('notifications preferences methods use the documented method, path and body', async () => {
  const { px, calls } = mockClient();
  await px.notifications.preferences();
  await px.notifications.setPreferences({ actionEmail: false });
  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/notifications/preferences'],
    ['PUT', '/api/v1/notifications/preferences'],
  ]);
  assert.deepEqual(calls[1].body, { actionEmail: false });
});

test('numbers call capacity methods use the documented method, path and body', async () => {
  const { px, calls } = mockClient();
  await px.numbers.callCapacity('d1');
  await px.numbers.setCallCapacity('d1', 4);
  assert.deepEqual(calls.map((c) => [c.method, c.path]), [
    ['GET', '/api/v1/dids/d1/call-capacity'],
    ['PUT', '/api/v1/dids/d1/call-capacity'],
  ]);
  assert.deepEqual(calls[1].body, { maxCalls: 4 });
});
