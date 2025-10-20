import type { IUser, RequestQuery } from "../../../entities/User.js";
import { PaginatedResponse } from "../../../entities/UserResponse.js";

export interface IUserInteractor {
  updateUser(id: string, data: IUser): Promise<IUser>;
  getAllUsers(query: RequestQuery): Promise<PaginatedResponse<IUser>>;
  deleteUser(id: string): Promise<IUser>;
  addUser(data: IUser): Promise<IUser>;
  getAUser(id: string): Promise<IUser>;
}
