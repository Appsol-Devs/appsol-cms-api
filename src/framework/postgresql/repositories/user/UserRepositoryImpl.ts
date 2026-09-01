import { injectable } from "inversify";
import { prisma } from "../../utils/prisma.js";

import type { IUser, RequestQuery } from "../../../../entities/User.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { UnprocessableEntityError } from "../../../../error_handler/UnprocessableEntityError.js";
import { createMapper } from "../../../utils/mapper.js";
import type { IUserRepository } from "../../../../domain/repositories/user/IUserRepository.js";

const UserDelegate = prisma.user;

const userMapper = {
  toEntity(record: any): IUser {
    const UserMapper = createMapper<IUser, typeof record>({
      mapIdToLegacyId: true,
    });
    return UserMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<IUser>) {
    const dto: any = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      ...(payload.roleId !== undefined && {
        role: { connect: { id: payload.roleId } },
      }),
      status: payload.status,
      isVerified: payload.isVerified,
    };
    return dto;
  },
  toDtoUpdate(payload: Partial<IUser>) {
    const dto: any = {};
    if (payload.firstName !== undefined) {
      dto.firstName = payload.firstName;
    }
    if (payload.lastName !== undefined) {
      dto.lastName = payload.lastName;
    }
    if (payload.email !== undefined) {
      dto.email = payload.email;
    }
    if (payload.password !== undefined) {
      dto.password = payload.password;
    }
    if (payload.phone !== undefined) {
      dto.phone = payload.phone;
    }
    if (payload.roleId !== undefined) {
      dto.role = { set: { id: payload.roleId } };
    }
    if (payload.status !== undefined) {
      dto.status = payload.status;
    }
    if (payload.isVerified !== undefined) {
      dto.isVerified = payload.isVerified;
    }
    return dto;
  },
};

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  async deleteUser(id: string): Promise<IUser> {
    if (!id) throw new UnprocessableEntityError("User id is required");

    const user = await UserDelegate.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User not found");

    await UserDelegate.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    const UserMapper = createMapper<IUser, typeof user>({
      mapIdToLegacyId: true,
    });

    return UserMapper.toEntity(user) as IUser;
  }

  async addUser(data: IUser): Promise<IUser> {
    if (!data) throw new UnprocessableEntityError("User data is required");
    const dto = userMapper.toDtoCreation(data as Partial<IUser>);
    const created = await UserDelegate.create({ data: dto });
    if (!created)
      throw new UnprocessableEntityError("User could not be created");
    const UserMapper = createMapper<IUser, typeof created>({
      mapIdToLegacyId: true,
    });
    return UserMapper.toEntity(created) as IUser;
  }

  async findAllUsers(query: RequestQuery): Promise<PaginatedResponse<IUser>> {
    const searchQuery = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = { isDeleted: false };
    if (searchQuery) {
      where.OR = [
        { firstName: { contains: searchQuery, mode: "insensitive" } },
        { lastName: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      UserDelegate.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          isVerified: true,
          email: true,
          phone: true,
          roleId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          isDeleted: true,
          status: true,
          password: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      UserDelegate.count({ where }),
    ]);

    const UserMapper = createMapper<IUser, (typeof users)[0]>({
      mapIdToLegacyId: true,
    });
    return {
      data: users.map(UserMapper.toEntity) as IUser[],
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      pageCount: pageIndex,
    };
  }

  async findUserByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<IUser | null | undefined> {
    const user = await UserDelegate.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: includePassword,
        phone: true,
        roleId: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });
    if (!user) return null;
    const UserMapper = createMapper<IUser, typeof user>({
      mapIdToLegacyId: true,
    });
    return UserMapper.toEntity(user) as IUser | null;
  }

  async findUserById(
    id: string,
    includePassword: boolean = false,
  ): Promise<IUser | null | undefined> {
    const user = await UserDelegate.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: includePassword,
        phone: true,
        roleId: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });
    if (!user) return null;
    const UserMapper = createMapper<IUser, typeof user>({
      mapIdToLegacyId: true,
    });
    return UserMapper.toEntity(user) as IUser | null;
  }

  async updateUser(id: string, data: IUser): Promise<IUser> {
    if (!id) throw new UnprocessableEntityError("User id is required");
    const dto = userMapper.toDtoUpdate(data as Partial<IUser>);
    const updatedUser = await UserDelegate.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        roleId: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const UserMapper = createMapper<IUser, typeof updatedUser>({
      mapIdToLegacyId: true,
    });
    return UserMapper.toEntity(updatedUser) as IUser;
  }
}
