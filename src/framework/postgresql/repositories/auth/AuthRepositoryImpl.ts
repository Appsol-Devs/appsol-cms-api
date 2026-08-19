import { injectable } from "inversify";

import type { IRole, IUser } from "../../../../entities/User.js";
import type { IUserOTP } from "../../../../entities/UserOTP.js";
import { ConflictError } from "../../../../error_handler/ConflictError.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { prisma } from "../../utils/prisma.js";

import { createMapper } from "../../../utils/mapper.js";
import type { IAuthRepository } from "../../../../domain/repositories/auth/IAuthRepository.js";

const UserDelegate = prisma.user;
const UserOtpDelegate = prisma.userOTP;

@injectable()
export class AuthRepositoryImpl implements IAuthRepository {
  async deleteManyOtps(id: string): Promise<IUserOTP> {
    const otp = await UserOtpDelegate.findFirst({ where: { userId: id } });
    if (!otp) {
      throw new NotFoundError("OTP not found");
    }

    await UserOtpDelegate.deleteMany({ where: { userId: id } });
    return otp as IUserOTP;
  }

  async deleteOtp(id: string): Promise<IUserOTP> {
    const otp = await UserOtpDelegate.findUnique({ where: { id } });
    if (!otp) {
      throw new NotFoundError("OTP not found");
    }

    await UserOtpDelegate.delete({ where: { id } });
    return otp as IUserOTP;
  }

  async findOtps(query: IUserOTP): Promise<IUserOTP[]> {
    const where: any = {};
    for (const key of Object.keys(query)) {
      const value = (query as any)[key];
      if (value !== undefined && value !== null) {
        where[key] = value;
      }
    }

    const otps = await UserOtpDelegate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return otps as IUserOTP[];
  }

  async addUserOTP(data: IUserOTP): Promise<IUserOTP> {
    if (!data.user || data.user === "" || data.user === null) {
      throw new NotFoundError("User ID is required to add OTP");
    }
    if (!data.otp || data.otp === null || data.otp === undefined) {
      throw new NotFoundError("OTP value is required to add OTP");
    }
    const { otp, expiresAt, user, createdAt } = data;
    const created = await UserOtpDelegate.create({
      data: {
        otp,
        expiresAt: expiresAt ?? new Date(),
        userId: data.user,
        createdAt: createdAt ?? new Date(),
      },
    });
    return created as IUserOTP;
  }

  async registerUser(data: IUser): Promise<IUser> {
    if (!data.email || data.email === "" || data.email === null) {
      throw new NotFoundError("Email is required to register user");
    }
    const existing = await UserDelegate.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictError("The email already exists");
    }

    if (!data.password || data.password === "" || data.password === null) {
      throw new NotFoundError("Password is required to register user");
    }

    const created = await UserDelegate.create({
      data: {
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        email: data.email,
        phone: data.phone ?? null,
        roleId: (data.role as IRole)?._id || (data.role as string),
        isActive: data.isActive ?? true,
        isVerified: data.isVerified ?? false,
        imageUrl: data.imageUrl ?? null,
        status: data.status ?? "active",
        password: data.password!,
        token: data.token ?? null,
        deviceToken: data.deviceToken ?? null,
        loginCount: data.loginCount ?? 0,
        lastLogin: data.lastLogin ?? new Date(),
        ...(data.lastLoginLocation && {
          lastLoginLocation: {
            latitude: data.lastLoginLocation.latitude,
            longitude: data.lastLoginLocation.longitude,
          },
        }),
      },
    });
    const UserMapper = createMapper<IUser, typeof created>();
    return UserMapper.toEntity(created) as IUser;
  }
}
