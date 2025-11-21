import type { TPriority } from "../utils/constants/genTypes.js";
import type { ICustomer } from "./Customer.js";
import type { ISoftware } from "./index.js";
import type { IUser, RequestQuery } from "./User.js";

export class IFeatureRequest {
  constructor(
    public readonly _id?: string,
    public readonly requestCode?: string,
    public readonly title?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly softwareId?: string,
    public software?: ISoftware | string,
    public readonly requestedDate?: string,
    public readonly notes?: string,
    public readonly description?: string,
    public readonly priority?: TPriority,
    public readonly status?: TFeatureRequestStatus,
    public readonly loggedBy?: IUser | string,
    public readonly assignedTo?: Array<IUser> | Array<string>,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type TFeatureRequestStatus =
  | "new"
  | "under-review"
  | "planned"
  | "complete"
  | "rejected";

export interface IFeatureRequestRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  priority?: TPriority | undefined;
  status?: TFeatureRequestStatus | undefined;
  softwareId?: string | undefined;
}
