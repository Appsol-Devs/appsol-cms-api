import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IPermission } from "../../../../entities/index.js";
import type { IPermissionRepository } from "../../../../domain/repositories/permission/IPermissionRepository.js";

const PermissionDelegate = prisma.permission;

const permissionMapper = {
  toEntity(record: any): IPermission {
    return {
      ...record,
      _id: record.id,
    } as IPermission;
  },
  toDtoCreation(payload: Partial<IPermission>) {
    const { _id, ...rest } = payload as any;
    return rest;
  },
};

@injectable()
export class PermissionRepositoryImpl
  extends PrismaBaseRepositoryImpl<IPermission>
  implements IPermissionRepository
{
  constructor() {
    super(PermissionDelegate, permissionMapper);
  }

  async add(data: IPermission): Promise<IPermission | null> {
    return this.create(data) as Promise<IPermission | null>;
  }

  async findOne(
    data: Partial<IPermission>,
  ): Promise<IPermission | null | undefined> {
    const permission = await PermissionDelegate.findFirst({
      where: { name: { equals: data.name ?? "", mode: "insensitive" } },
    });
    return permission ? permissionMapper.toEntity(permission) : null;
  }

  async findAll(): Promise<IPermission[]> {
    const permissions = await PermissionDelegate.findMany({
      orderBy: { name: "asc" },
    });
    return permissions.map((permission) =>
      permissionMapper.toEntity(permission),
    );
  }
}
