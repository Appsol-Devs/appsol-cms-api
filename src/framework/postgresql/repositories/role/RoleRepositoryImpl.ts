import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IRole } from "../../../../entities/index.js";

const RoleDelegate = prisma.role;

const roleMapper = {
  toEntity(record: any): IRole {
    return record as IRole;
  },
  toDtoCreation(payload: Partial<IRole>) {
    return payload;
  },
};

@injectable()
export class RoleRepositoryImpl extends PrismaBaseRepositoryImpl<IRole> {
  constructor() {
    super(RoleDelegate, roleMapper);
  }
}
