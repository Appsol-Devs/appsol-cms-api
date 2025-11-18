import { inject, injectable } from "inversify";
import type { IUser, RequestQuery } from "../../../entities/User.js";

import type { IUserInteractor } from "./IUserInteractor.js";

import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../../error_handler/index.js";
import { PaginatedResponse } from "../../../entities/UserResponse.js";
import type { IUserRepository } from "../../../framework/mongodb/index.js";
import type { IAuthService } from "../../../framework/services/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class UserInteractorImpl implements IUserInteractor {
  private userRepository: IUserRepository;
  private authService: IAuthService;

  constructor(
    @inject(INTERFACE_TYPE.UserRepositoryImpl) userRepository: IUserRepository,
    @inject(INTERFACE_TYPE.AuthServiceImpl) authService: IAuthService
  ) {
    this.userRepository = userRepository;
    this.authService = authService;
  }
  async getAUser(id: string): Promise<IUser> {
    if (!id) throw new UnprocessableEntityError("User id is required");
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundError("User not found");
    const { password: pass, ...rest } = user;
    return { ...rest };
  }
  async deleteUser(id: string): Promise<IUser> {
    if (!id) throw new UnprocessableEntityError("User id is required");
    const deletedUser = await this.userRepository.deleteUser(id);
    if (!deletedUser) throw new BadRequestError("Error deleting user");
    return deletedUser;
  }

  async addUser(data: IUser): Promise<IUser> {
    if (!data) throw new UnprocessableEntityError("User data is required");

    const existingUser = await this.userRepository.findUserByEmail(data.email!);
    if (existingUser) throw new BadRequestError("The email already exists");
    let userData = { ...data };

    const hashedPassword = await this.authService.encriptPassword(
      data.password!
    );

    userData = {
      ...data,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.addUser(userData);
    if (!newUser) throw new BadRequestError("Error while adding user");
    const { password: pass, ...rest } = newUser;
    return { ...rest };
  }
  getAllUsers(query: RequestQuery): Promise<PaginatedResponse<IUser>> {
    return this.userRepository.findAllUsers(query);
  }
  async updateUser(id: string, data: IUser): Promise<IUser> {
    if (!id) throw new UnprocessableEntityError("User id is required");
    if (!data) throw new UnprocessableEntityError("User data is required");

    let body = { ...data };
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundError("User not found");
    body = { ...body };

    const updatedUser = await this.userRepository.updateUser(id, body);

    if (!updatedUser) throw new Error("Error while updating user");
    return updatedUser;
  }
}
