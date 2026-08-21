import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ILeadStatus } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const LeadStatusDelegate = prisma.leadStatus;

const leadStatusMapper = {
  toEntity(record: any): ILeadStatus {
    return record as ILeadStatus;
  },
  toDtoCreation(payload: Partial<ILeadStatus>) {
    return payload;
  },
};

@injectable()
export class LeadStatusRepositoryImpl extends PrismaBaseRepositoryImpl<ILeadStatus> {
  constructor() {
    super(LeadStatusDelegate, leadStatusMapper);
  }

  create(data: ILeadStatus): Promise<ILeadStatus | null | undefined> {
    const leadStatusCode = generateModelCode("LS");
    data.leadStatusCode = leadStatusCode;
    return super.create(data);
  }
}
