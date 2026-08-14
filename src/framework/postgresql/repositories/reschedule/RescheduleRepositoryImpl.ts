import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  IReschedule,
  type IRescheduleRequestQuery,
} from "../../../../entities/Reschedule.js";

const RescheduleDelegate = prisma.reschedule;

const rescheduleMapper = {
  toEntity(record: any): IReschedule {
    return new IReschedule(
      record.id,
      record.rescheduleCode,
      record.colorCode,
      record.reason,
      record.title,
      record.targetEntityId,
      record.targetEntity,
      record.customer,
      record.customerId,
      record.originalDateTime?.toISOString(),
      record.newDateTime?.toISOString(),
      record.from?.toISOString(),
      record.to?.toISOString(),
      record.targetEntityType,
      record.status,
      record.loggedById,
      record.createdAt?.toISOString(),
      record.updatedAt?.toISOString(),
    );
  },
  toDtoCreation(payload: Partial<IReschedule>) {
    return payload as any;
  },
};

@injectable()
export class RescheduleRepositoryImpl extends PrismaBaseRepositoryImpl<IReschedule> {
  constructor() {
    super(RescheduleDelegate, rescheduleMapper);
  }

  async getAll(query: IRescheduleRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { rescheduleCode: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.customerId) where.customerId = query.customerId;
    if (query.targetEntityType) where.targetEntityType = query.targetEntityType;
    if (query.targetEntityId) where.targetEntityId = query.targetEntityId;
    if (query.status) where.status = query.status;
    if (query.loggedBy) where.loggedById = query.loggedBy;
    if (query.originalDateTime) where.originalDateTime = query.originalDateTime;
    if (query.newDateTime) where.newDateTime = query.newDateTime;

    if (query.startDate && query.endDate) {
      where.createdAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true, loggedBy: true },
        orderBy: { createdAt: "desc" },
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

  async getById(id: string) {
    const record = await this.delegate.findUnique({
      where: { id },
      include: { customer: true, loggedBy: true },
    });
    if (!record) throw new Error("Schedule not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<IReschedule>) {
    const created = await this.delegate.create({
      data: data as any,
      include: { customer: true, loggedBy: true },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<IReschedule>) {
    const updated = await this.delegate.update({
      where: { id },
      data: data as any,
      include: { customer: true, loggedBy: true },
    });
    return this.mapper.toEntity(updated);
  }
}
