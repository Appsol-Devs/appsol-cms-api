import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  ICustomerOutreach,
  type ICustomerOutreachRequestQuery,
} from "../../../../entities/CustomerOutreach.js";

const CustomerOutreachDelegate = prisma.customerOutreach;

const customerOutreachMapper = {
  toEntity(record: any): ICustomerOutreach {
    return new ICustomerOutreach(
      record.id,
      record.outreachCode,
      record.customerId,
      record.customer,
      record.purpose,
      record.notes,
      record.callStatusId,
      record.callStatus,
      record.outreachTypeId,
      record.outreachType,
      record.isRoutineCall,
      record.status,
      record.loggedById,
      record.resolvedById,
      record.createdAt?.toISOString(),
      record.updatedAt?.toISOString(),
    );
  },
  toDtoCreation(payload: Partial<ICustomerOutreach>) {
    const dto: any = {
      outreachCode: payload.outreachCode,
      customerId: payload.customerId,
      purpose: payload.purpose,
      notes: payload.notes,
      callStatusId: payload.callStatusId,
      outreachTypeId: payload.outreachTypeId,
      isRoutineCall: payload.isRoutineCall,
      status: payload.status,
      loggedById: payload.loggedBy as string,
      softwareId: (payload as any).softwareId,
    };
    return dto;
  },
};

@injectable()
export class CustomerOutreachRepositoryImpl extends PrismaBaseRepositoryImpl<ICustomerOutreach> {
  constructor() {
    super(CustomerOutreachDelegate, customerOutreachMapper);
  }

  async getAll(query: ICustomerOutreachRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { outreachCode: { contains: search, mode: "insensitive" } },
        { purpose: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.customerId) where.customerId = query.customerId;
    if (query.callStatusId) where.callStatusId = query.callStatusId;
    if (query.status) where.status = query.status;
    if (query.loggedBy) where.loggedById = query.loggedBy;
    if (query.resolvedBy) where.resolvedBy = query.resolvedBy;
    if (query.outreachTypeId) where.outreachTypeId = query.outreachTypeId;

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
        include: {
          customer: {
            select: { name: true, email: true, phone: true, companyName: true },
          },
          callStatus: true,
          loggedBy: true,
          outreachType: true,
        },
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
        callStatus: true,
        loggedBy: true,
        outreachType: true,
      },
    });
    if (!record) throw new Error("Customer outreach not found");
    return this.mapper.toEntity(record);
  }

  // assign references for create/update
  private assignReferences(data: Partial<ICustomerOutreach>) {
    const dto: any = {};
    if (data.customerId) dto.customerId = data.customerId;
    if (data.callStatusId) dto.callStatusId = data.callStatusId;
    if (data.outreachTypeId) dto.outreachTypeId = data.outreachTypeId;
    if ((data as any).softwareId) dto.softwareId = (data as any).softwareId;
    if (data.loggedBy) dto.loggedById = data.loggedBy as string;
    return dto;
  }

  async create(data: Partial<ICustomerOutreach>) {
    const dto = { ...data, ...this.assignReferences(data) } as any;
    const created = await this.delegate.create({
      data: dto,
      include: {
        customer: true,
        callStatus: true,
        loggedBy: true,
        outreachType: true,
      },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<ICustomerOutreach>) {
    const dto = { ...data, ...this.assignReferences(data) } as any;
    const updated = await this.delegate.update({
      where: { id },
      data: dto,
      include: {
        customer: true,
        callStatus: true,
        loggedBy: true,
        outreachType: true,
      },
    });
    return this.mapper.toEntity(updated);
  }
}
