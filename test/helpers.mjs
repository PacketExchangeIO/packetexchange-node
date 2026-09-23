import { PacketExchange } from '../dist/index.js';

/**
 * Build a client whose `fetch` is a recorder. Every request is captured so a test can
 * assert the method, path, query, headers and body the SDK sent. No network is used.
 *
 * `respond(req)` returns `{ status?, body?, headers? }`; the default is an empty
 * success envelope.
 */
export function mockClient(respond = () => ({ body: { success: true, data: {} } }), options = {}) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    const u = new URL(url);
    const req = {
      method: init.method,
      url: u,
      path: u.pathname,
      query: Object.fromEntries(u.searchParams),
      headers: init.headers ?? {},
      body: init.body === undefined ? undefined : JSON.parse(init.body),
    };
    calls.push(req);
    const { status = 200, body = { success: true, data: {} }, headers = {} } = respond(req) ?? {};
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    return new Response(text, { status, headers: { 'content-type': 'application/json', ...headers } });
  };
  const px = new PacketExchange({ apiKey: 'test-key', fetch, ...options });
  return { px, calls };
}
