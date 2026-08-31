import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import { ISubscription, type ISubscriptionRequestQuery } from "../../../../entities/Subscription.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";

const SubscriptionDelegate = prisma.subscription;

const subscriptionMapper = {
  toEntity(record: any): ISubscription {
    const SubscriptionMapper = createMapper<ISubscription, typeof record>({
      mapIdToLegacyId: true,
    });
    return SubscriptionMapper.toEntity(record)!;
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

    async getAll(query: ISubscriptionRequestQuery,
  ): Promise<PaginatedResponse<ISubscription>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: any = {};

    // Search
    if (search) {
      filter.OR = [
        {
          subscriptionCode: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Simple filters
    if (query.customerId) {
      filter.customerId = query.customerId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.softwareId) {
      filter.softwareId = query.softwareId;
    }

    if (query.subscriptionTypeId) {
      filter.subscriptionTypeId = query.subscriptionTypeId;
    }

    if (query.autoRenew !== undefined) {
      filter.autoRenew = query.autoRenew;
    }

    // Created date range
    if (query.startDate || query.endDate) {
      filter.createdAt = {};

      if (query.startDate) {
        filter.createdAt.gte = new Date(query.startDate);
      }

      if (query.endDate) {
        filter.createdAt.lte = new Date(query.endDate);
      }
    }

    // Current period date range
    if (query.currentPeriodStart || query.currentPeriodEnd) {
      filter.currentPeriodStart = {};

      if (query.currentPeriodStart) {
        filter.currentPeriodStart.gte = new Date(
          query.currentPeriodStart,
        );
      }

      if (query.currentPeriodEnd) {
        filter.currentPeriodStart.lte = new Date(
          query.currentPeriodEnd,
        );
      }
    }

    // Next billing date range
    if (query.nextBillingDate) {
      filter.nextBillingDate = {};

      if (query.nextBillingDate.gte) {
        filter.nextBillingDate.gte = new Date(
          query.nextBillingDate.gte,
        );
      }

      if (query.nextBillingDate.lte) {
        filter.nextBillingDate.lte = new Date(
          query.nextBillingDate.lte,
        );
      }
    }

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          customer: true,
          software: true,
          loggedBy: true,
          subscriptionType: true,
          lastPayment: {
            include: {
              customer: true,
              software: true,
              subscriptionType: true,
            },
          },
        },
      }),

      this.delegate.count({
        where: filter,
      }),
    ]);

    return {
      data: items.map(this.mapper.toEntity),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageCount: pageIndex,
    };
  }

  async getById(id: string): Promise<ISubscription> {
    const subscription = await this.delegate.findUnique({
      where: { id },
      include: {
        customer: true,
        software: true,
        loggedBy: true,
        subscriptionType: true,
        lastPayment: {
          include: {
            customer: true,
            software: true,
            subscriptionType: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundError("Subscription Reminder not found");
    }

    return this.mapper.toEntity(subscription);
  }

  async create(data: Partial<ISubscription>): Promise<ISubscription> {
    const subscriptionCode = generateModelCode("SUB");
    data.subscriptionCode = subscriptionCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }

   async update(
    id: string,
    data: Partial<ISubscription>,
  ): Promise<ISubscription> {
    const dto = this.mapper.toDtoCreation(data);

    const updated = await this.delegate.update({
      where: { id },
      data: dto as any,
      include: {
        customer: true,
        software: true,
        loggedBy: true,
        subscriptionType: true,
        lastPayment: {
          include: {
            customer: true,
            software: true,
            subscriptionType: true,
          },
        },
      },
    });

    if (!updated) {
      throw new NotFoundError("Subscription Reminder not found");
    }

    return this.mapper.toEntity(updated);
  }

}
