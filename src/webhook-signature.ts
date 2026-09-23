/**
 * Webhook signature verification.
 *
 * Every delivery carries two signatures:
 *
 *   X-PX-Timestamp:      <unix seconds at send time>
 *   X-PX-Signature:      v1=<hex HMAC-SHA256(secret, "<timestamp>.<raw body>")>   (current)
 *   X-Webhook-Signature: sha256=<hex HMAC-SHA256(secret, "<raw body>")>           (legacy)
 *
 * The v1 signature covers the timestamp, so a captured delivery cannot be replayed
 * later: timestamps outside `toleranceSeconds` are rejected. The legacy signature has
 * no timestamp and so cannot stop replays; it is checked only when both v1 headers are
 * absent, and can be refused outright with `allowLegacy: false`.
 *
 * The implementation uses WebCrypto (`globalThis.crypto.subtle`), so the same code runs
 * on Node.js 20+, Deno, Bun, edge runtimes and browsers without importing `node:crypto`.
 */

/** Anything header-shaped: a Fetch `Headers`, or a Node/Express header object. */
export type HeaderSource =
  | { get(name: string): string | null }
  | Record<string, string | string[] | undefined>;

export interface VerifyWebhookSignatureParams {
  /** The endpoint's signing secret (shown once at create / rotate). */
  secret: string;
  /**
   * The request body EXACTLY as received. Do not JSON.parse and re-stringify it:
   * key order or whitespace changes break the HMAC.
   */
  rawBody: string | Uint8Array | ArrayBuffer;
  /** The request headers. */
  headers: HeaderSource;
  /** Maximum age (and future skew) of X-PX-Timestamp, in seconds. Default 300. */
  toleranceSeconds?: number;
  /** Accept the legacy body-only signature when v1 headers are absent. Default true. */
  allowLegacy?: boolean;
  /** Override "now" (Unix seconds), for tests. */
  now?: number;
}

export interface VerifyWebhookSignatureResult {
  valid: boolean;
  /** Which signature was checked. */
  scheme: 'v1' | 'legacy' | 'none';
  /** Why verification failed, when it did. */
  reason?: 'missing_signature' | 'stale_timestamp' | 'bad_timestamp' | 'mismatch' | 'legacy_disallowed';
  /** The X-PX-Timestamp value, when present and numeric. */
  timestamp?: number;
}

const enc = new TextEncoder();

function header(h: HeaderSource, name: string): string | undefined {
  if (typeof (h as { get?: unknown }).get === 'function') {
    return (h as { get(n: string): string | null }).get(name) ?? undefined;
  }
  // Node lowercases incoming header names; accept any casing for hand-built objects.
  const rec = h as Record<string, string | string[] | undefined>;
  const key = Object.keys(rec).find((k) => k.toLowerCase() === name.toLowerCase());
  const v = key ? rec[key] : undefined;
  return Array.isArray(v) ? v[0] : v;
}

function toBytes(body: string | Uint8Array | ArrayBuffer): Uint8Array {
  if (typeof body === 'string') return enc.encode(body);
  return body instanceof Uint8Array ? body : new Uint8Array(body);
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

async function hmacHex(secret: string, data: Uint8Array): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('WebCrypto (globalThis.crypto.subtle) is required to verify webhook signatures.');
  const key = await subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await subtle.sign('HMAC', key, data as unknown as ArrayBuffer));
  let hex = '';
  for (const b of sig) hex += b.toString(16).padStart(2, '0');
  return hex;
}

/** Constant-time string compare, so timing cannot leak how many characters matched. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

/**
 * Verify a PacketExchange webhook delivery. Resolves to `{ valid, scheme, reason? }`
 * and never throws for a bad signature (only when WebCrypto is unavailable), so a
 * receiver can log the reason and answer 400.
 *
 *   const { valid } = await verifyWebhookSignature({ secret, rawBody, headers: req.headers });
 *   if (!valid) return res.status(400).end();
 */
export async function verifyWebhookSignature(p: VerifyWebhookSignatureParams): Promise<VerifyWebhookSignatureResult> {
  const tolerance = p.toleranceSeconds ?? 300;
  const body = toBytes(p.rawBody);
  const tsHeader = header(p.headers, 'x-px-timestamp');
  const v1Header = header(p.headers, 'x-px-signature');

  if (tsHeader !== undefined || v1Header !== undefined) {
    // A v1 delivery: both headers must be present and agree. Never fall back to the
    // legacy signature here, or stripping the v1 headers would dodge the replay check.
    if (!tsHeader || !v1Header) return { valid: false, scheme: 'v1', reason: 'missing_signature' };
    // Digits only: the signature covers the header text exactly as sent.
    if (!/^\d+$/.test(tsHeader)) return { valid: false, scheme: 'v1', reason: 'bad_timestamp' };
    const ts = Number(tsHeader);
    const now = p.now ?? Math.floor(Date.now() / 1000);
    if (Math.abs(now - ts) > tolerance) return { valid: false, scheme: 'v1', reason: 'stale_timestamp', timestamp: ts };
    const expected = await hmacHex(p.secret, concat(enc.encode(`${tsHeader}.`), body));
    // Accept a comma-separated list of signatures; any matching v1 entry is enough.
    const candidates = v1Header
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('v1='))
      .map((s) => s.slice(3));
    const valid = candidates.some((c) => safeEqual(c.toLowerCase(), expected));
    return valid ? { valid, scheme: 'v1', timestamp: ts } : { valid, scheme: 'v1', reason: 'mismatch', timestamp: ts };
  }

  const legacy = header(p.headers, 'x-webhook-signature');
  if (!legacy) return { valid: false, scheme: 'none', reason: 'missing_signature' };
  if (p.allowLegacy === false) return { valid: false, scheme: 'legacy', reason: 'legacy_disallowed' };
  const expected = await hmacHex(p.secret, body);
  const given = legacy.startsWith('sha256=') ? legacy.slice(7) : legacy;
  const valid = safeEqual(given.toLowerCase(), expected);
  return valid ? { valid, scheme: 'legacy' } : { valid, scheme: 'legacy', reason: 'mismatch' };
}
