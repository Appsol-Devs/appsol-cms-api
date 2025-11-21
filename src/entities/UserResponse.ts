import { IUser } from "./User.js";

export class UserRegistrationResponse {
  constructor(
    public readonly status: string,
    public readonly message: string,
    public readonly data?: UserRegistrationResponseData
  ) {}
}

class UserRegistrationResponseData {
  constructor(public readonly userId: string, public readonly email: string) {}
}

export class UserOTPResponse {
  constructor(
    public readonly status: string,
    public readonly message: string,
    public readonly data?: IUser | UserRegistrationResponseData
  ) {}
}

export class PaginatedResponse<T> {
  constructor(
    public readonly data: T[],
    public readonly pageCount: number,
    public readonly totalCount: number,
    public readonly totalPages: number,
    public readonly totalSum?: number,
    public readonly totalPending?: number,
    public readonly totalApproved?: number
  ) {}
}
