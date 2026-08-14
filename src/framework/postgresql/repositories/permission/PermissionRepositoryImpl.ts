import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IPermission } from "../../../../entities/index.js";

const PermissionDelegate = prisma.permission;

const permissionMapper = {
  toEntity(record: any): IPermission {
    return record as IPermission;
  },
  toDtoCreation(payload: Partial<IPermission>) {
    return payload;
  },
};

@injectable()
export class PermissionRepositoryImpl extends PrismaBaseRepositoryImpl<IPermission> {
  constructor() {
    super(PermissionDelegate, permissionMapper);
  }
}
