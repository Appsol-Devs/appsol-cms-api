import type { ICustomer } from "./Customer.js";
import type { ICustomerComplaint } from "./CustomerComplaint.js";
import type { ICustomerOutreach } from "./CustomerOutreach.js";
import type { IUser, RequestQuery } from "./User.js";

export class IReschedule {
  constructor(
    public readonly _id?: string,
    public readonly rescheduleCode?: string,
    public readonly colorCode?: string,
    public readonly reason?: string,
    public readonly targetEntityId?: string,
    public targetEntity?: ICustomerOutreach | ICustomerComplaint | string,
    public customer?: ICustomer | string,
    public readonly customerId?: string,
    public readonly originalDateTime?: string,
    public readonly newDateTime?: string,
    public readonly targetEntityType?: TargetEntityType,
    public readonly status?: "pending" | "approved" | "rejected",
    public readonly loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type TargetEntityType =
  | "CustomerOutreach"
  | "CustomerComplaint"
  | "SubscriptionReminder";

export interface IRescheduleRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  targetEntityType?: TargetEntityType | undefined;
  targetEntityId?: string | undefined;
  status?: "pending" | "approved" | "rejected" | undefined;
  loggedBy?: string | undefined;
  originalDateTime?: string | undefined;
  newDateTime?: string | undefined;
}
