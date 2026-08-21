import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ICallStatus } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const CallStatusDelegate = prisma.callStatus;

const callStatusMapper = {
  toEntity(record: any): ICallStatus {
    const CallStatusMapper = createMapper<ICallStatus, typeof record>({
      mapIdToLegacyId: true,
    });
    return CallStatusMapper.toEntity(record)!;
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
