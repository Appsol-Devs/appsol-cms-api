import type { IDateRange } from "../utils/constants/genTypes.js";
import type { ICustomer } from "./Customer.js";
import type { ISoftware } from "./lookups/Software.js";
import type { ISubscriptionType } from "./lookups/SubscriptionType.js";
import type { IUser, RequestQuery } from "./User.js";

export class IPayment {
  constructor(
    public readonly _id?: string,
    public readonly paymentCode?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly softwareId?: string,
    public software?: ISoftware | string,
    public readonly subscriptionTypeId?: string,
    public subscriptionType?: ISubscriptionType | string,
    public readonly notes?: string,
    public readonly amount?: number,
    public readonly totalDue?: number,
    public readonly paymentDate?: string,
    public readonly renewalDate?: string,
    public readonly status?: "pending" | "approved" | "rejected" | "generated",
    public readonly loggedBy?: IUser | string,
    public readonly approvedOrRejectedBy?: IUser | string,
    public readonly approvalNotes?: string,
    public readonly paymentReference?: string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export interface IPaymentRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  subscriptionTypeId?: string | undefined;
  status?: "pending" | "approved" | "rejected" | "generated" | undefined;
  loggedBy?: string | undefined;
  paymentDate?: string | undefined;
  renewalDate?: IDateRange;
}
