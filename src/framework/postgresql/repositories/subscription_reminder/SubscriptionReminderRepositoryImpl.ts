import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type {
  ISubscriptionReminder,
  ISubscriptionReminderRequestQuery,
} from "../../../../entities/SubscriptionReminder.js";
import { generateModelCode } from "../../../../utils/helpers.js";

const ReminderDelegate = prisma.subscriptionReminder;

const reminderMapper = {
  toEntity(record: any): ISubscriptionReminder {
    return {
      _id: record.id,
      reminderCode: record.reminderCode,
      customerId: record.customerId,
      customer: record.customer,
      title: record.title,
      message: record.message,
      softwareId: record.softwareId,
      software: record.software,
      paymentId: record.paymentId,
      payment: record.payment,
      subscriptionId: record.subscriptionId,
      subscription: record.subscription,
      dueDate: record.dueDate && new Date(record.dueDate),
      nextBillingDate:
        record.nextBillingDate && new Date(record.nextBillingDate),
      lastNotifiedType: record.lastNotifiedType,
      isSent: record.isSent,
      reminderType: record.reminderType,
      sentVia: record.sentVia,
    } as ISubscriptionReminder;
  },
  toDtoCreation(payload: Partial<ISubscriptionReminder>) {
    return {
      reminderCode: (payload as any).reminderCode,
      customerId: payload.customerId,
      title: payload.title,
      message: payload.message,
      softwareId: payload.softwareId,
      paymentId: payload.paymentId,
      subscriptionId: payload.subscriptionId,
      dueDate: payload.dueDate,
      nextBillingDate: payload.nextBillingDate,
      lastNotifiedType: payload.lastNotifiedType,
      isSent: payload.isSent,
      reminderType: payload.reminderType,
      sentVia: payload.sentVia,
    };
  },
};

@injectable()
export class SubscriptionReminderRepositoryImpl extends PrismaBaseRepositoryImpl<ISubscriptionReminder> {
  constructor() {
    super(ReminderDelegate, reminderMapper);
  }

  async create(
    data: Partial<ISubscriptionReminder>,
  ): Promise<ISubscriptionReminder> {
    const reminderCode = generateModelCode("REM");
    data.reminderCode = reminderCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }

  async getAll(query: ISubscriptionReminderRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) where.reminderCode = { contains: search, mode: "insensitive" };
    if (query.customerId) where.customerId = query.customerId;
    if (query.softwareId) where.softwareId = query.softwareId;
    if (query.isSent !== undefined) where.isSent = query.isSent;
    if (query.sentVia) where.sentVia = query.sentVia;
    if (query.startDate && query.endDate)
      where.createdAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          software: true,
          payment: true,
          subscription: true,
        },
      }),
      this.delegate.count({ where }),
    ]);

    return {
      data: items.map(this.mapper.toEntity),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageCount: pageIndex,
    };
  }
}
