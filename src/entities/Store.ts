import type { RequestQuery } from "./User.js";
import type { ICustomer } from "./Customer.js";
import type { IUser } from "./User.js";

export class IStore {
  constructor(
    public readonly _id?: string,
    public readonly storeCode?: string,
    public readonly customerId?: string,
    public customer?: ICustomer | string,
    public readonly name?: string,
    public readonly location?: string,
    public readonly notes?: string,
    public readonly status?: StoreStatus,
    public loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) {}
}

export type StoreStatus = "active" | "inactive";

export interface IStoreRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  status?: StoreStatus | undefined;
}
