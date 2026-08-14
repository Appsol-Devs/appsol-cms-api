import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ISubscriptionType } from "../../../../entities/index.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";

const SubscriptionTypeDelegate = prisma.subscriptionType;

const subscriptionTypeMapper = {
  toEntity(record: any): ISubscriptionType {
    return record as ISubscriptionType;
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
}
