import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PacketExchange, PacketExchangeError, DEFAULT_BASE_URL } from '../dist/index.js';
import { mockClient } from './helpers.mjs';

test('sends the API key as a Bearer token to the default base URL', async () => {
  const { px, calls } = mockClient(() => ({ body: { success: true, data: { id: 'u1' } } }));
  const account = await px.account.get();
  assert.deepEqual(account, { id: 'u1' });
  assert.equal(DEFAULT_BASE_URL, 'https://packetexchange.io/api/v1');
  assert.equal(calls[0].url.origin + calls[0].path, 'https://packetexchange.io/api/v1/account');
  assert.equal(calls[0].headers.Authorization, 'Bearer test-key');
});

test('honours a custom base URL and trims the trailing slash', async () => {
  const { px, calls } = mockClient(undefined, { baseUrl: 'http://127.0.0.1:4010/api/v1/' });
  await px.account.balance();
  assert.equal(calls[0].url.href, 'http://127.0.0.1:4010/api/v1/account/balance');
});

test('maps the error envelope to PacketExchangeError', async () => {
  const { px } = mockClient(() => ({
    status: 400,
    headers: { 'x-request-id': '3f1c2a9e-0000-4000-8000-000000000000' },
    body: {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: [{ path: 'to', message: 'Invalid E.164 number' }] },
    },
  }));
  await assert.rejects(px.comms.sms({ to: 'x', from: 'Acme', body: 'hi' }), (err) => {
    assert.ok(err instanceof PacketExchangeError);
    assert.equal(err.status, 400);
    assert.equal(err.code, 'VALIDATION_ERROR');
    assert.deepEqual(err.details, [{ path: 'to', message: 'Invalid E.164 number' }]);
    assert.equal(err.requestId, '3f1c2a9e-0000-4000-8000-000000000000');
    assert.equal(err.isAuthError, false);
    return true;
  });
});

test('flags auth and rate-limit errors', async () => {
  const { px } = mockClient((req) =>
    req.path.endsWith('/account')
      ? { status: 401, body: { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid API key' } } }
      : { status: 429, body: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } } },
  );
  await assert.rejects(px.account.get(), (e) => e.isAuthError && e.code === 'UNAUTHORIZED');
  await assert.rejects(px.routes.countries(), (e) => e.isRateLimited && e.status === 429);
});

test('turns a non-JSON error body into a synthetic HTTP_<status> code', async () => {
  const { px } = mockClient(() => ({ status: 502, body: 'Bad Gateway' }));
  await assert.rejects(px.account.get(), (e) => e.code === 'HTTP_502' && e.status === 502);
});

test('reports a transport failure as NETWORK_ERROR with status 0', async () => {
  const px = new PacketExchange({
    apiKey: 'test-key',
    fetch: async () => {
      throw new TypeError('fetch failed');
    },
  });
  await assert.rejects(px.account.get(), (e) => e instanceof PacketExchangeError && e.code === 'NETWORK_ERROR' && e.status === 0);
});

test('sms maps `body` to the API `message` field and sets the idempotency key', async () => {
  const { px, calls } = mockClient(() => ({ body: { success: true, data: { messageId: 'm1', status: 'accepted', cost: '0.004000' } } }));
  const res = await px.comms.sms({ to: '+447700900123', from: 'Acme', body: 'Your code is 482913' }, { idempotencyKey: 'order-1' });
  assert.equal(res.messageId, 'm1');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].path, '/api/v1/comms/sms');
  assert.deepEqual(calls[0].body, { to: '+447700900123', from: 'Acme', message: 'Your code is 482913' });
  assert.equal(calls[0].headers['X-Idempotency-Key'], 'order-1');
});

test('page() returns data with cursor metadata and paginate() follows nextCursor', async () => {
  const { px, calls } = mockClient((req) =>
    req.query.cursor === 'c2'
      ? { body: { success: true, data: [{ id: 'r3' }], nextCursor: null, hasMore: false } }
      : { body: { success: true, data: [{ id: 'r1' }, { id: 'r2' }], nextCursor: 'c2', hasMore: true, total: 3 } },
  );
  const page = await px.routes.list({ country: 'GB', type: 'voice' });
  assert.equal(page.total, 3);
  assert.equal(page.nextCursor, 'c2');
  assert.equal(calls[0].query.country, 'GB');

  const ids = [];
  for await (const r of px.routes.listAll({ country: 'GB' })) ids.push(r.id);
  assert.deepEqual(ids, ['r1', 'r2', 'r3']);
  assert.equal(calls.at(-1).query.cursor, 'c2');
});
