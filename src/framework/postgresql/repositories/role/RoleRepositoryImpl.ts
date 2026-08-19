import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IRole, RequestQuery } from "../../../../entities/index.js";
import type { IRoleRepository } from "../../../../domain/repositories/role/IRoleRepository.js";
import { BadRequestError } from "../../../../error_handler/BadRequestError.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";

const RoleDelegate = prisma.role;

const roleMapper = {
  toEntity(record: any): IRole {
    return {
      ...record,
      _id: record.id,
    } as IRole;
  },
  toDtoCreation(payload: Partial<IRole>) {
    const { _id, ...rest } = payload as any;
    return rest;
  },
};

@injectable()
export class RoleRepositoryImpl
  extends PrismaBaseRepositoryImpl<IRole>
  implements IRoleRepository
{
  constructor() {
    super(RoleDelegate, roleMapper);
  }

  async findByName(name: string): Promise<IRole | null | undefined> {
    if (!name) throw new BadRequestError("Role name is required");

    const role = await RoleDelegate.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        isDeleted: false,
      },
    });

    return role ? roleMapper.toEntity(role) : null;
  }

  async getARole(id: string): Promise<IRole | null | undefined> {
    return this.getById(id);
  }

  async addRole(data: IRole): Promise<IRole | null | undefined> {
    return this.create(data);
  }

  async updateRole(id: string, data: IRole): Promise<IRole | null | undefined> {
    if (!id) throw new BadRequestError("Role id is required");
    if (!data) throw new BadRequestError("Role data is required");

    return this.update(id, data as Partial<IRole>);
  }

  async deleteRole(id: string): Promise<IRole | null | undefined> {
    if (!id) throw new BadRequestError("Role id is required");

    const role = await this.getById(id);
    if (!role) return null;

    const deleted = await RoleDelegate.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    if (!deleted) throw new NotFoundError("Role not found");
    return roleMapper.toEntity(deleted);
  }

  async getAllRoles(query: RequestQuery): Promise<IRole[]> {
    const limit = query.pageSize ?? 10;
    const pageIndex = query.pageIndex ?? 1;
    const skip = (pageIndex - 1) * limit;
    const searchQuery = query.search ?? "";

    const where: any = { isDeleted: false };
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const roles = await RoleDelegate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return roles.map((role) => roleMapper.toEntity(role));
  }
}
