import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ISubscriptionType } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const SubscriptionTypeDelegate = prisma.subscriptionType;

const subscriptionTypeMapper = {
  toEntity(record: any): ISubscriptionType {
    const SubscriptionTypeMapper = createMapper<
      ISubscriptionType,
      typeof record
    >({
      mapIdToLegacyId: true,
    });
    return SubscriptionTypeMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ISubscriptionType>) {
    return payload;
  },
};

@injectable()
export class SubscriptionTypeRepositoryImpl extends PrismaBaseRepositoryImpl<ISubscriptionType> {
  constructor() {
    super(SubscriptionTypeDelegate, subscriptionTypeMapper);
  }

  create(
    data: ISubscriptionType,
  ): Promise<ISubscriptionType | null | undefined> {
    const subscriptionTypeCode = generateModelCode("ST");
    data.subscriptionTypeCode = subscriptionTypeCode;
    return super.create(data);
  }
}
