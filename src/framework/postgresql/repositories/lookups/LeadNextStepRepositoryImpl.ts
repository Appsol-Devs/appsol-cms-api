import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ILeadNextStep } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
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

  create(data: ILeadNextStep): Promise<ILeadNextStep | null | undefined> {
    const leadNextStepCode = generateModelCode("LNS");
    data.leadNextStepCode = leadNextStepCode;
    return super.create(data);
  }
}
