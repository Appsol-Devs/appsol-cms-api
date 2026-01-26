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
    public readonly complaintCategoryId?: string,
    public complaintCategory?: IComplaintCategory | string,
    public readonly description?: string,
    public readonly relatedSoftwareId?: string,
    public readonly resolvedAt?: string,
    public relatedSoftware?: ISoftware | string,
    public readonly status?: TCustomerComplaintStatus,
    public readonly loggedBy?: IUser | string,
    public readonly resolvedBy?: IUser | string,
    public readonly createdAt?: Date | string,
    public readonly updatedAt?: Date | string,
  ) {}
}

export const COMPLAINT_STATUSES = [
  "open",
  "in-progress",
  "rescheduled",
  "resolved",
  "closed",
] as const;

export type TCustomerComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export interface ICustomerComplaintRequestQuery extends RequestQuery {
  customerId?: string;
  complaintTypeId?: string;
  complaintCategoryId?: string | undefined;
  relatedSoftwareId?: string;
  status?: TCustomerComplaintStatus;
  loggedBy?: string;
  resolvedBy?: string;
}
