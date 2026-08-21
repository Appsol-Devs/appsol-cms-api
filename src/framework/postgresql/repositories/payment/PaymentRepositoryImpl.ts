import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type {
  IPayment,
  IPaymentRequestQuery,
} from "../../../../entities/Payment.js";
import { generateModelCode } from "../../../../utils/helpers.js";

const PaymentDelegate = prisma.payment;

const paymentMapper = {
  toEntity(record: any): IPayment {
    return {
      _id: record.id,
      paymentCode: record.paymentCode,
      customerId: record.customerId,
      customer: record.customer,
      softwareId: record.softwareId,
      software: record.software,
      approvalNotes: record.approvalNotes,
      amount: record.amount,
      totalDue: record.totalDue,
      subscriptionTypeId: record.subscriptionTypeId,
      subscriptionType: record.subscriptionType,
      notes: record.notes,
      paymentDate: record.paymentDate && new Date(record.paymentDate),
      renewalDate: record.renewalDate && new Date(record.renewalDate),
      loggedBy: record.loggedById,
      approvedOrRejectedBy: record.approvedOrRejectedById,
      status: record.status,
      paymentReference: record.paymentReference,
      subscriptionId: record.subscriptionId,
    } as IPayment;
  },
  toDtoCreation(payload: Partial<IPayment>) {
    return {
      paymentCode: (payload as any).paymentCode,
      customerId: payload.customerId,
      softwareId: payload.softwareId,
      approvalNotes: payload.approvalNotes,
      amount: payload.amount,
      totalDue: payload.totalDue,
      subscriptionTypeId: payload.subscriptionTypeId,
      notes: payload.notes,
      paymentDate: payload.paymentDate,
      renewalDate: payload.renewalDate,
      loggedById: payload.loggedBy as string,
      approvedOrRejectedById: payload.approvedOrRejectedBy as string,
      status: payload.status,
      paymentReference: payload.paymentReference,
      subscriptionId: payload.subscriptionId,
    };
  },
};

@injectable()
export class PaymentRepositoryImpl extends PrismaBaseRepositoryImpl<IPayment> {
  constructor() {
    super(PaymentDelegate, paymentMapper);
  }

  async create(data: Partial<IPayment>): Promise<IPayment> {
    const paymentCode = generateModelCode("PY");
    data.paymentCode = paymentCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }

  async getAll(query: IPaymentRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { paymentCode: { contains: search, mode: "insensitive" } },
        { approvalNotes: { contains: search, mode: "insensitive" } },
      ];
    }
    if (query.softwareId) where.softwareId = query.softwareId;
    if (query.customerId) where.customerId = query.customerId;
    if (query.subscriptionTypeId)
      where.subscriptionTypeId = query.subscriptionTypeId;
    if (query.status) where.status = query.status;
    if (query.loggedBy) where.loggedById = query.loggedBy;
    if (query.paymentDate) where.paymentDate = query.paymentDate;
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
          loggedBy: true,
          approvedOrRejectedBy: true,
          software: true,
          subscriptionType: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.delegate.count({ where }),
    ]);

    // calculate aggregates similar to Mongo implementation
    const totals = await this.delegate
      .aggregate({
        _sum: { amount: true },
        _count: { id: true },
        where,
      } as any)
      .catch(() => null);

    return {
      data: items.map(this.mapper.toEntity),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageCount: pageIndex,
      totalSum: totals?._sum?.amount ?? 0,
    };
  }
}
