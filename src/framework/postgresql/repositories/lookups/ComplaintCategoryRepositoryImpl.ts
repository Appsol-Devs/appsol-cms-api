import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IComplaintCategory } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const ComplaintCategoryDelegate = prisma.complaintCategory;

const complaintCategoryMapper = {
  toEntity(record: any): IComplaintCategory {
    const ComplaintCategoryMapper = createMapper<
      IComplaintCategory,
      typeof record
    >({
      mapIdToLegacyId: true,
    });
    return ComplaintCategoryMapper.toEntity(record)!;
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

  create(
    data: IComplaintCategory,
  ): Promise<IComplaintCategory | null | undefined> {
    const complaintCategoryCode = generateModelCode("CC");
    data.complaintCategoryCode = complaintCategoryCode;
    return super.create(data);
  }
}
