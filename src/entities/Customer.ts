import type { IGeolocation } from "./Lead.js";
import type { ISoftware } from "./lookups/Software.js";
import type { IUser, RequestQuery } from "./User.js";

export class ICustomer {
  constructor(
    public readonly _id?: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly companyName?: string,
    public readonly dateConverted?: string,
    public readonly notes?: string,
    public readonly geolocation?: IGeolocation,
    public readonly softwareId?: string,
    public software?: ISoftware | string,
    public readonly location?: string,
    public readonly status?: CustomerStatus,
    public readonly loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
    public readonly image?: string,
    public readonly leadId?: string,
  ) {}
}

export type CustomerStatus = "active" | "inactive";

export interface ICustomerRequestQuery extends RequestQuery {
  status?: CustomerStatus | undefined;
  softwareId?: string | undefined;
}
