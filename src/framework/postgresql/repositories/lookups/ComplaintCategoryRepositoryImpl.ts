import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IComplaintCategory } from "../../../../entities/index.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const ComplaintCategoryDelegate = prisma.complaintCategory;

const complaintCategoryMapper = {
  toEntity(record: any): IComplaintCategory {
    return record as IComplaintCategory;
  },
  toDtoCreation(payload: Partial<IComplaintCategory>) {
    return payload;
  },
};

@injectable()
export class ComplaintCategoryRepositoryImpl extends PrismaBaseRepositoryImpl<IComplaintCategory> {
  constructor() {
    super(ComplaintCategoryDelegate, complaintCategoryMapper);
  }
}
