import type { IGeolocation } from "./Lead.js";
import type { IUser } from "./User.js";

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
    public readonly location?: string,
    public readonly status?: CustomerStatus,
    public readonly loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type CustomerStatus = "active" | "inactive";
