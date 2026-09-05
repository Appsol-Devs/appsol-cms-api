import type { IUser, RequestQuery } from "../../../entities/index.js";
import type { PaginatedResponse } from "../../../entities/UserResponse.js";

export interface IUserRepository {
  updateUser(id: string, data: IUser): Promise<IUser>;
  findUserById(
    id: string,
    includePassword?: boolean,
  ): Promise<IUser | null | undefined>;
  findUserByEmail(
    email: string,
    includePassword?: boolean,
  ): Promise<IUser | null | undefined>;
  findAllUsers(query: RequestQuery): Promise<PaginatedResponse<IUser>>;
  deleteUser(id: string): Promise<IUser>;
  addUser(data: IUser): Promise<IUser>;
}
