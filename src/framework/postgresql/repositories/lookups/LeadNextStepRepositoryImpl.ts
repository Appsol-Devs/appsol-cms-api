import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ILeadNextStep } from "../../../../entities/index.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const LeadNextStepDelegate = prisma.leadNextStep;

const leadNextStepMapper = {
  toEntity(record: any): ILeadNextStep {
    return record as ILeadNextStep;
  },
  toDtoCreation(payload: Partial<ILeadNextStep>) {
    return payload;
  },
};

@injectable()
export class LeadNextStepRepositoryImpl extends PrismaBaseRepositoryImpl<ILeadNextStep> {
  constructor() {
    super(LeadNextStepDelegate, leadNextStepMapper);
  }
}
