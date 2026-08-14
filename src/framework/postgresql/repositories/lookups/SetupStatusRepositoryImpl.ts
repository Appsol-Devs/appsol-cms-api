import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ISetupStatus } from "../../../../entities/index.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const SetupStatusDelegate = prisma.setupStatus;

const setupStatusMapper = {
  toEntity(record: any): ISetupStatus {
    return record as ISetupStatus;
  },
  toDtoCreation(payload: Partial<ISetupStatus>) {
    return payload;
  },
};

@injectable()
export class SetupStatusRepositoryImpl extends PrismaBaseRepositoryImpl<ISetupStatus> {
  constructor() {
    super(SetupStatusDelegate, setupStatusMapper);
  }
}
