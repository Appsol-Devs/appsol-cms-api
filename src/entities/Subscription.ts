import type { IDateRange } from "../utils/constants/genTypes.js";
import type { ICustomer } from "./Customer.js";
import type { IPayment } from "./Payment.js";
import type { RequestQuery } from "./User.js";
import type { ISoftware } from "./lookups/Software.js";
import type { ISubscriptionType } from "./lookups/SubscriptionType.js";

export class ISubscription {
  constructor(
    public readonly _id?: string,
    public readonly subscriptionCode?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly softwareId?: string,
    public software?: ISoftware | string,
    public readonly subscriptionTypeId?: string,
    public subscriptionType?: ISubscriptionType | string,
    public readonly status?: TSubscriptionStatus,
    public readonly startDate?: Date,
    public readonly currentPeriodStart?: Date,
    public readonly currentPeriodEnd?: Date,
    public readonly nextBillingDate?: Date,
    public readonly lastPaymentId?: string,
    public lastPayment?: IPayment | string,
    public readonly lastPaymentDate?: Date,
    public readonly amount?: number,
    public readonly autoRenew?: boolean,
    public readonly cancelledAt?: Date,
    public readonly cancelledBy?: string,
    public readonly cancellationReason?: string,
    public readonly notes?: string,
    public readonly loggedBy?: string,
  ) {}
}

export type TSubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "pending";

export interface ISubscriptionRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  softwareId?: string | undefined;
  subscriptionTypeId?: string | undefined;
  status?: TSubscriptionStatus | undefined;
  startDate?: string | undefined;
  currentPeriodStart?: string | undefined;
  currentPeriodEnd?: string | undefined;
  nextBillingDate?: IDateRange;
  lastPaymentId?: string | undefined;
  lastPaymentDate?: IDateRange;
  autoRenew?: boolean | undefined;
}
