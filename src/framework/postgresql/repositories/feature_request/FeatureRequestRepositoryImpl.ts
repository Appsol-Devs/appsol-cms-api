import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  IFeatureRequest,
  type IFeatureRequestRequestQuery,
} from "../../../../entities/FeatureRequest.js";

const FeatureRequestDelegate = prisma.featureRequest;

const featureRequestMapper = {
  toEntity(record: any): IFeatureRequest {
    return new IFeatureRequest(
      record.id,
      record.requestCode,
      record.title,
      record.customerId,
      record.customer,
      record.softwareId,
      record.software,
      record.requestedDate?.toISOString(),
      record.notes,
      record.description,
      record.priority,
      record.status,
      record.loggedById,
      record.assignedTo,
      record.createdAt?.toISOString(),
      record.updatedAt?.toISOString(),
    );
  },
  toDtoCreation(payload: Partial<IFeatureRequest>) {
    const dto: any = {
      requestCode: payload.requestCode,
      title: payload.title,
      customerId: payload.customerId,
      softwareId: payload.softwareId,
      requestedDate: payload.requestedDate,
      notes: payload.notes,
      description: payload.description,
      priority: payload.priority,
      status: payload.status,
      loggedById: payload.loggedBy as string,
      assignedTo: payload.assignedTo,
    };
    return dto;
  },
};

@injectable()
export class FeatureRequestRepositoryImpl extends PrismaBaseRepositoryImpl<IFeatureRequest> {
  constructor() {
    super(FeatureRequestDelegate, featureRequestMapper);
  }

  async getAll(query: IFeatureRequestRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { requestCode: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.customerId) where.customerId = query.customerId;
    if (query.priority) where.priority = query.priority;
    if (query.status) where.status = query.status;
    if (query.loggedBy) where.loggedById = query.loggedBy;
    if (query.softwareId) where.softwareId = query.softwareId;
    if (query.assignedTo) where.assignedTo = { hasSome: query.assignedTo };

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
        include: { customer: true, loggedBy: true, software: true },
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
      include: { customer: true, loggedBy: true, software: true },
    });
    if (!record) throw new Error("Feature Request not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<IFeatureRequest>) {
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({
      data: dto,
      include: { customer: true, loggedBy: true, software: true },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<IFeatureRequest>) {
    const dto = data as any;
    const updated = await this.delegate.update({
      where: { id },
      data: dto,
      include: { customer: true, loggedBy: true, software: true },
    });
    return this.mapper.toEntity(updated);
  }
}
