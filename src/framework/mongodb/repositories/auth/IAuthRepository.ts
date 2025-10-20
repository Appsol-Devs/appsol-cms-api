import type { IUser } from "../../../../entities/User.js";
import type { IUserOTP } from "../../../../entities/UserOTP.js";

export interface IAuthRepository {
  deleteManyOtps(id: string): Promise<IUserOTP>;
  findOtps(query: IUserOTP): Promise<IUserOTP[]>;
  registerUser(data: IUser): Promise<IUser>;
  addUserOTP(data: IUserOTP): Promise<IUserOTP>;
  deleteOtp(id: string): Promise<IUserOTP>;
}
