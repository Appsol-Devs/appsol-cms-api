import type { IUser, RequestQuery } from "./User.js";

export class IVisitor {
  constructor(
    public readonly _id: string, // ObjectId as string
    public readonly visitorCode?: string,
    public readonly fullName?: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly company?: string,
    public readonly idType?: string,
    public readonly idNumber?: string,
    public readonly visitingWhom?: string,
    public readonly purpose?: string,
    public readonly checkInTime?: Date,
    public readonly checkOutTime?: Date,
    public readonly passNumber?: string,
    public readonly itemsCarriedIn?: string,
    public readonly itemsCarriedOut?: string,
    public readonly status?: TVisitorStatus,
    public readonly loggedBy?: IUser | string,
    public readonly photoUrl?: string,
    public readonly notes?: string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type TVisitorStatus = "checked_in" | "checked_out";

export interface IVisitorRequestQuery extends RequestQuery {
  checkInTime?: string | undefined;
  checkOutTime?: string | undefined;
  fullName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
}
