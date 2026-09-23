import type { HttpClient, RequestOptions } from '../http.js';
import type { DidAiAgent } from '../generated/schemas.js';

export type { DidAiAgent };

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
}
