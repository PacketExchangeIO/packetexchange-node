import type { HttpClient, RequestOptions } from '../http.js';
import type { NumberLookup } from '../generated/schemas.js';

/**
 * Number lookup: validate and format a number, and see its country, line type
 * (mobile, fixed, toll free, premium), the network where the marketplace's rate decks
 * agree, blocked and high-risk flags, and the cheapest live voice and SMS price to
 * reach it. SMS prices are per destination network where the route prices that way.
 *
 * The answer is prefix-based: no carrier HLR query is made, so it cannot tell you
 * whether a number is in service or has been ported. Lookups are free and limited to
 * 60 a minute per caller.
 */
export class LookupResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * GET /lookup/:number - look up one number. Send it in international format
   * (`+447700900123`; spaces and dashes are ignored). A malformed number resolves with
   * `valid: false` and a `reason` rather than throwing.
   */
  number(number: string, opts?: RequestOptions): Promise<NumberLookup> {
    return this.http.request<NumberLookup>('GET', `/lookup/${encodeURIComponent(number.trim())}`, opts);
  }
}
