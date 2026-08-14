import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IComplaintType } from "../../../../entities/index.js";

const ComplaintTypeDelegate = prisma.complaintType;

const complaintTypeMapper = {
  toEntity(record: any): IComplaintType {
    return record as IComplaintType;
  },
  toDtoCreation(payload: Partial<IComplaintType>) {
    return payload;
  },
};

@injectable()
export class ComplaintTypeRepositoryImpl extends PrismaBaseRepositoryImpl<IComplaintType> {
  constructor() {
    super(ComplaintTypeDelegate, complaintTypeMapper);
  }
}
