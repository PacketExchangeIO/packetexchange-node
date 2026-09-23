import { HttpClient, type PacketExchangeOptions } from './http.js';
import { RoutesResource } from './resources/routes.js';
import { CommsResource } from './resources/comms.js';
import { DialerResource } from './resources/dialer.js';
import { PurchasesResource } from './resources/purchases.js';
import { OffersResource } from './resources/offers.js';
import { BillingResource } from './resources/billing.js';
import { AccountResource } from './resources/account.js';
import { WebhooksResource } from './resources/webhooks.js';
import { CliTestsResource } from './resources/cli-tests.js';
import { InterconnectionsResource } from './resources/interconnections.js';
import { VerifyResource } from './resources/verify.js';
import { LookupResource } from './resources/lookup.js';
import { NumbersResource } from './resources/numbers.js';
import {
  NotificationsResource,
  DncResource,
  FavoritesResource,
  SavedSearchesResource,
} from './resources/misc.js';

/**
 * The PacketExchange API client: a thin, typed wrapper over the documented REST API
 * (base path `/api/v1`).
 *
 *   const px = new PacketExchange({ apiKey: process.env.PACKETEXCHANGE_API_KEY });
 *   const route = (await px.routes.resolve({ to: '+447911123456' })).selected;
 *   await px.comms.call({ to: '+447911123456', from: '+15551230000' });
 *
 * Auth: pass `apiKey` (sent as `Authorization: Bearer <key>`) or a user `accessToken`
 * (JWT). A test key (`wmmn_test_sk_...`) simulates calls and SMS against the account's
 * test credit instead of placing real traffic.
 */
export class PacketExchange {
  /** Low-level HTTP core (exposed for advanced/custom requests). */
  readonly http: HttpClient;

  readonly routes: RoutesResource;
  readonly comms: CommsResource;
  readonly dialer: DialerResource;
  readonly purchases: PurchasesResource;
  readonly offers: OffersResource;
  readonly billing: BillingResource;
  readonly account: AccountResource;
  readonly webhooks: WebhooksResource;
  readonly cliTests: CliTestsResource;
  readonly interconnections: InterconnectionsResource;
  /** Verify API: send a one-time code by SMS or voice and check it. */
  readonly verify: VerifyResource;
  /** Number lookup: country, line type, network, risk flags and cheapest price (free, prefix-based). */
  readonly lookup: LookupResource;
  /** Phone numbers you bought. */
  readonly numbers: NumbersResource;
  readonly notifications: NotificationsResource;
  readonly dnc: DncResource;
  readonly favorites: FavoritesResource;
  readonly savedSearches: SavedSearchesResource;

  constructor(opts: PacketExchangeOptions = {}) {
    this.http = new HttpClient(opts);
    this.routes = new RoutesResource(this.http);
    this.comms = new CommsResource(this.http);
    this.dialer = new DialerResource(this.http);
    this.purchases = new PurchasesResource(this.http);
    this.offers = new OffersResource(this.http);
    this.billing = new BillingResource(this.http);
    this.account = new AccountResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.cliTests = new CliTestsResource(this.http);
    this.interconnections = new InterconnectionsResource(this.http);
    this.verify = new VerifyResource(this.http);
    this.lookup = new LookupResource(this.http);
    this.numbers = new NumbersResource(this.http);
    this.notifications = new NotificationsResource(this.http);
    this.dnc = new DncResource(this.http);
    this.favorites = new FavoritesResource(this.http);
    this.savedSearches = new SavedSearchesResource(this.http);
  }
}
