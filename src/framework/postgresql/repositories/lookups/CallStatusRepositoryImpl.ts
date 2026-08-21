import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ICallStatus } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const CallStatusDelegate = prisma.callStatus;

const callStatusMapper = {
  toEntity(record: any): ICallStatus {
    return record as ICallStatus;
  },
  toDtoCreation(payload: Partial<ICallStatus>) {
    return payload;
  },
};

@injectable()
export class CallStatusRepositoryImpl extends PrismaBaseRepositoryImpl<ICallStatus> {
  constructor() {
    super(CallStatusDelegate, callStatusMapper);
  }

  create(data: ICallStatus): Promise<ICallStatus | null | undefined> {
    const callStatusCode = generateModelCode("CS");
    data.callStatusCode = callStatusCode;
    return super.create(data);
  }
}
