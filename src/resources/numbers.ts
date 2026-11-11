import type { HttpClient, RequestOptions } from '../http.js';
import type { Did, DidAiAgent, DidCallCapacityOffer } from '../generated/schemas.js';

export type { DidAiAgent };

/** What the call capacity methods answer (HTTP 200) while the number store is switched off. */
export interface NumberStoreDisabled {
  disabled: true;
  comingSoon: true;
  message: string;
}

/** A number's call capacity, from `numbers.callCapacity()`. */
export interface DidCallCapacity {
  /** True when the number is active, so the setting can be changed. */
  available: boolean;
  /** `null` when extra calls at once are not available for the number. */
  offer: DidCallCapacityOffer | null;
}

/**
 * Phone numbers you bought. The rest of the number API (`/dids/*`) is in the API
 * reference and callable through `px.http.request`.
 */
export class NumbersResource {
  constructor(private readonly http: HttpClient) {}

  /** GET /dids/:id/ai-agent - the AI voice agent assigned to a number (scope: numbers:read). */
  getAiAgent(numberId: string, opts?: RequestOptions): Promise<DidAiAgent> {
    return this.http.request<DidAiAgent>('GET', `/dids/${encodeURIComponent(numberId)}/ai-agent`, opts);
  }

  /**
   * PUT /dids/:id/ai-agent - assign one of your AI voice agents to a number, or pass
   * `null` to return the number to its call flow (scope: numbers:write). `live` in the
   * response says whether inbound AI answering is currently enabled on the platform.
   */
  setAiAgent(numberId: string, agentId: string | null, opts?: RequestOptions): Promise<DidAiAgent> {
    return this.http.request<DidAiAgent>('PUT', `/dids/${encodeURIComponent(numberId)}/ai-agent`, {
      ...opts,
      body: { agentId },
    });
  }

  /**
   * GET /dids/:id/call-capacity - the channels included with the number, its current
   * setting, the most you may choose and the per-minute price of calls beyond the
   * included channels (scope: numbers:read).
   */
  callCapacity(numberId: string, opts?: RequestOptions): Promise<DidCallCapacity | NumberStoreDisabled> {
    return this.http.request<DidCallCapacity | NumberStoreDisabled>(
      'GET',
      `/dids/${encodeURIComponent(numberId)}/call-capacity`,
      opts,
    );
  }

  /**
   * PUT /dids/:id/call-capacity - set how many calls the number takes at once, from the
   * included channels up to `offer.limit`. Takes effect at once; each minute of a call
   * beyond the included channels is billed at `perMinuteUsd` (scope: numbers:write, live
   * key).
   */
  setCallCapacity(
    numberId: string,
    maxCalls: number,
    opts?: RequestOptions,
  ): Promise<{ did: Did; offer: DidCallCapacityOffer | null } | NumberStoreDisabled> {
    return this.http.request<{ did: Did; offer: DidCallCapacityOffer | null } | NumberStoreDisabled>(
      'PUT',
      `/dids/${encodeURIComponent(numberId)}/call-capacity`,
      { ...opts, body: { maxCalls } },
    );
  }
}
