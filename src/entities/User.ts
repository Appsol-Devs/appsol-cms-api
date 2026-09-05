import type { IGeolocation } from "./Lead.js";

export class IUser {
  constructor(
    public readonly id?: string,
    public readonly firstName?: string | null,
    public readonly lastName?: string | null,
    public readonly email?: string | null,
    public readonly phone?: string | null,
    public readonly role?: IRole | null,
    public readonly roleId?: string | null,
    public readonly isActive?: boolean,
    public readonly isVerified?: boolean,
    public readonly imageUrl?: string | null,
    public readonly status?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly password?: string | null,
    public readonly token?: string | null,
    public readonly deviceToken?: string | null,
    public readonly createdBy?: string | null,
    public readonly loginCount?: number,
    public readonly lastLogin?: string | null,
    public readonly lastLoginLocation?: Geolocation,
    public readonly loginLocations?: Geolocation[],
  ) {}
}

export interface Geolocation {
  longitude: number;
  latitude: number;
  timestamp: Date;
}
export class IRole {
  constructor(
    public readonly id?: string | null,
    public readonly _id?: string | null,
    public readonly name?: string | null,
    public readonly description?: string | null,
    public readonly companyId?: string | null,
    public readonly permissions?: string[] | null, // Permissions granted to this role
  ) {}
}

export class UserPasswordChangeRequest {
  constructor(
    public readonly currentPassword: string,
    public readonly newPassword: string,
    public readonly userId: string,
  ) {}
}

export interface UserRequest extends Request {
  user?: IUser;
}

export interface RequestQuery {
  search?: string | null | undefined;
  pageSize?: number | undefined;
  pageIndex?: number | undefined;
  startDate?: Date | string | undefined;
  endDate?: Date | string | undefined;
  status?: string | null | undefined;
  loggedBy?: string | null | undefined;
  createdBy?: string | null | undefined;
}
