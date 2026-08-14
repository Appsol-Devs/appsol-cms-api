import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  ICustomerSetup,
  type ICustomerSetupRequestQuery,
} from "../../../../entities/CustomerSetup.js";

const CustomerSetupDelegate = prisma.customerSetup;

const customerSetupMapper = {
  toEntity(record: any): ICustomerSetup {
    return new ICustomerSetup(
      record.id,
      record.setupCode,
      record.title,
      record.customerId,
      record.customer,
      record.softwareId,
      record.software,
      record.setupStatusId,
      record.setupStatus,
      record.scheduledStart?.toISOString(),
      record.scheduledEnd?.toISOString(),
      record.actualCompletionDate?.toISOString(),
      record.notes,
      record.description,
      record.priority,
      record.status,
      record.loggedById,
      record.assignedTo,
      record.createdAt?.toISOString(),
      record.updatedAt?.toISOString(),
      record.addToCalendar,
    );
  },
  toDtoCreation(payload: Partial<ICustomerSetup>) {
    const dto: any = {
      setupCode: payload.setupCode,
      title: payload.title,
      customerId: payload.customerId,
      softwareId: payload.softwareId,
      setupStatusId: payload.setupStatusId,
      scheduledStart: payload.scheduledStart,
      scheduledEnd: payload.scheduledEnd,
      actualCompletionDate: payload.actualCompletionDate,
      notes: payload.notes,
      description: payload.description,
      priority: payload.priority,
      status: payload.status,
      loggedById: payload.loggedBy as string,
      assignedTo: payload.assignedTo,
      addToCalendar: payload.addToCalendar,
    };
    return dto;
  },
};

@injectable()
export class CustomerSetupRepositoryImpl extends PrismaBaseRepositoryImpl<ICustomerSetup> {
  constructor() {
    super(CustomerSetupDelegate, customerSetupMapper);
  }

  async getAll(query: ICustomerSetupRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { setupCode: { contains: search, mode: "insensitive" } },
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
    if (query.setupStatusId) where.setupStatusId = query.setupStatusId;

    if (query.startDate && query.endDate) {
      where.scheduledStart = {
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
      include: {
        customer: true,
        loggedBy: true,
        software: true,
        setupStatus: true,
      },
    });
    if (!record) throw new Error("Customer Setup not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<ICustomerSetup>) {
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({
      data: dto,
      include: {
        customer: true,
        loggedBy: true,
        software: true,
        setupStatus: true,
      },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<ICustomerSetup>) {
    const dto = data as any;
    const updated = await this.delegate.update({
      where: { id },
      data: dto,
      include: {
        customer: true,
        loggedBy: true,
        software: true,
        setupStatus: true,
      },
    });
    return this.mapper.toEntity(updated);
  }
}
