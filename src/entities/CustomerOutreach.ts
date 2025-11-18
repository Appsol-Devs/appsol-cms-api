import type { ICustomer } from "./Customer.js";
import type { IGeolocation } from "./Lead.js";
import type { ICallStatus } from "./lookups/CallStatus.js";
import type { IComplaintCategory } from "./lookups/ComplaintCategory.js";
import type { IComplaintType } from "./lookups/ComplaintType.js";
import type { IOutreachType } from "./lookups/OutreachType.js";
import type { ISoftware } from "./lookups/Software.js";
import type { IUser, RequestQuery } from "./User.js";

export class ICustomerOutreach {
  constructor(
    public readonly _id?: string,
    public readonly outreachCode?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly purpose?: string,
    public readonly notes?: string,
    public readonly callStatusId?: string,
    public callStatus?: ICallStatus | string,
    public readonly outreachTypeId?: string,
    public outreachType?: IOutreachType | string,
    public readonly isRoutineCall?: boolean,
    public readonly status?: ICustomerOutreachStatus,
    public readonly loggedBy?: IUser | string,
    public readonly resolvedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type ICustomerOutreachStatus =
  | "pending"
  | "completed"
  | "failed"
  | "rescheduled"
  | "cancelled";

export interface ICustomerOutreachRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  callStatusId?: string | undefined;
  status?: ICustomerOutreachStatus;
  loggedBy?: string | undefined;
  resolvedBy?: string | undefined;
  outreachTypeId?: string | undefined;
}
