import type { TPriority } from "../utils/constants/genTypes.js";
import type { ICustomer } from "./Customer.js";
import type { ISetupStatus, ISoftware } from "./index.js";
import type { IUser, RequestQuery } from "./User.js";

export class ICustomerSetup {
  constructor(
    public readonly _id?: string,
    public readonly setupCode?: string,
    public readonly title?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly softwareId?: string,
    public software?: ISoftware | string,
    public readonly setupStatusId?: string,
    public setupStatus?: ISetupStatus | string,
    public readonly scheduledStart?: string,
    public readonly scheduledEnd?: string,
    public readonly actualCompletionDate?: string,
    public readonly notes?: string,
    public readonly description?: string,
    public readonly priority?: TPriority,
    public readonly status?: TCustomerSetupStatus,
    public readonly loggedBy?: IUser | string,
    public readonly assignedTo?: Array<IUser> | Array<string>,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type TCustomerSetupStatus =
  | "scheduled"
  | "inProgress"
  | "completed"
  | "cancelled";

export interface ICustomerSetupRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  priority?: TPriority | undefined;
  status?: TCustomerSetupStatus | undefined;
  softwareId?: string | undefined;
  assignedTo?: Array<string> | undefined;
  setupStatusId?: string | undefined;
}
