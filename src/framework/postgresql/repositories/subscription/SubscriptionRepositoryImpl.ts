import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import { ISubscription } from "../../../../entities/Subscription.js";
import { generateModelCode } from "../../../../utils/helpers.js";

const SubscriptionDelegate = prisma.subscription;

const subscriptionMapper = {
  toEntity(record: any): ISubscription {
    return new ISubscription(
      record.id,
      record.subscriptionCode,
      record.customerId,
      record.customer,
      record.softwareId,
      record.software,
      record.subscriptionTypeId,
      record.subscriptionType,
      record.status,
      record.startDate && new Date(record.startDate),
      record.currentPeriodStart && new Date(record.currentPeriodStart),
      record.currentPeriodEnd && new Date(record.currentPeriodEnd),
      record.nextBillingDate && new Date(record.nextBillingDate),
      record.lastPaymentId,
      record.lastPayment,
      record.lastPaymentDate && new Date(record.lastPaymentDate),
      record.amount,
      record.autoRenew,
      record.cancelledAt && new Date(record.cancelledAt),
      record.cancelledById,
      record.cancellationReason,
      record.notes,
      record.loggedById,
    );
  },
  toDtoCreation(payload: Partial<ISubscription>) {
    const dto: any = {
      subscriptionCode: (payload as any).subscriptionCode,
      customerId: (payload as any).customerId,
      softwareId: (payload as any).softwareId,
      subscriptionTypeId: (payload as any).subscriptionTypeId,
      status: payload.status,
      startDate: payload.startDate,
      currentPeriodStart: payload.currentPeriodStart,
      currentPeriodEnd: payload.currentPeriodEnd,
      nextBillingDate: payload.nextBillingDate,
      amount: payload.amount,
      autoRenew: payload.autoRenew,
      notes: payload.notes,
      loggedById: payload.loggedBy as string,
    };

    return dto;
  },
};

@injectable()
export class SubscriptionRepositoryImpl extends PrismaBaseRepositoryImpl<ISubscription> {
  constructor() {
    super(SubscriptionDelegate, subscriptionMapper);
  }

  async create(data: Partial<ISubscription>): Promise<ISubscription> {
    const subscriptionCode = generateModelCode("SUB");
    data.subscriptionCode = subscriptionCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }
}
