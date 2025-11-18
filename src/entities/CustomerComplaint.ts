import type { ICustomer } from "./Customer.js";
import type { IGeolocation } from "./Lead.js";
import type { IComplaintCategory } from "./lookups/ComplaintCategory.js";
import type { IComplaintType } from "./lookups/ComplaintType.js";
import type { ISoftware } from "./lookups/Software.js";
import type { IUser, RequestQuery } from "./User.js";

export class ICustomerComplaint {
  constructor(
    public readonly _id?: string,
    public readonly complaintCode?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly complaintTypeId?: string,
    public complaintType?: IComplaintType | string,
    public readonly categoryId?: string,
    public category?: IComplaintCategory | string,
    public readonly description?: string,
    public readonly relatedSoftwareId?: string,
    public relatedSoftware?: ISoftware | string,
    public readonly status?: ICustomerComplaintStatus,
    public readonly loggedBy?: IUser | string,
    public readonly resolvedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type ICustomerComplaintStatus =
  | "open"
  | "in-progress"
  | "resolved"
  | "closed"
  | "rescheduled";

export interface ICustomerComplaintRequestQuery extends RequestQuery {
  customerId?: string;
  complaintTypeId?: string;
  categoryId?: string;
  relatedSoftwareId?: string;
  status?: ICustomerComplaintStatus;
  loggedBy?: string;
  resolvedBy?: string;
}
