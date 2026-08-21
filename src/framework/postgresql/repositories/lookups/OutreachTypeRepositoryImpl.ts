import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { IOutreachType } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const OutreachTypeDelegate = prisma.outreachType;

const outreachTypeMapper = {
  toEntity(record: any): IOutreachType {
    const OutreachTypeMapper = createMapper<IOutreachType, typeof record>({
      mapIdToLegacyId: true,
    });
    return OutreachTypeMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<IOutreachType>) {
    return payload;
  },
};

@injectable()
export class OutreachTypeRepositoryImpl extends PrismaBaseRepositoryImpl<IOutreachType> {
  constructor() {
    super(OutreachTypeDelegate, outreachTypeMapper);
  }

  create(data: IOutreachType): Promise<IOutreachType | null | undefined> {
    const outreachTypeCode = generateModelCode("OT");
    data.outreachTypeCode = outreachTypeCode;
    return super.create(data);
  }
}
