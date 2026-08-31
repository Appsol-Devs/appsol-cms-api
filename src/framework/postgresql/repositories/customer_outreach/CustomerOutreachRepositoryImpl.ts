import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  ICustomerOutreach,
  type ICustomerOutreachRequestQuery,
} from "../../../../entities/CustomerOutreach.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";

const CustomerOutreachDelegate = prisma.customerOutreach;

const customerOutreachMapper = {
  toEntity(record: any): ICustomerOutreach {
    const OutreachMapper = createMapper<ICustomerOutreach, typeof record>({
      mapIdToLegacyId: true,
    });
    return OutreachMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ICustomerOutreach>) {
    const dto: any = {
      outreachCode: payload.outreachCode,
      // customerId: payload.customerId,
      customer: { connect: { id: payload.customerId } },
      purpose: payload.purpose,
      notes: payload.notes,
      //callStatusId: payload.callStatusId,
      callStatus: { connect: { id: payload.callStatusId } },
      // outreachTypeId: payload.outreachTypeId,
      outreachType: { connect: { id: payload.outreachTypeId } },
      isRoutineCall: payload.isRoutineCall,
      status: payload.status,
      // loggedById: payload.loggedBy as string,
      loggedBy: { connect: { id: payload.loggedById } },
      //softwareId: (payload as any).softwareId,
      //software: { connect: { id: (payload as any).softwareId } },
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

  async create(data: Partial<ICustomerOutreach>) {
    const outreachCode = generateModelCode("OUT");
    data.outreachCode = outreachCode;
    const dto = { ...this.mapper.toDtoCreation(data) } as any;
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
    const dto = { ...data } as any;
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
