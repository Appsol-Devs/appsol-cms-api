import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type {
  ICustomerComplaint,
  ICustomerComplaintRequestQuery,
} from "../../../../entities/CustomerComplaint.js";
import type { PaginatedResponse } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import { BadRequestError } from "../../../../error_handler/BadRequestError.js";

const CustomerComplaintDelegate = prisma.customerComplaint;

const customerComplaintMapper = {
  toEntity(record: any): ICustomerComplaint {
    const CustomerComplaintMapper = createMapper<
      ICustomerComplaint,
      typeof record
    >({
      mapIdToLegacyId: true,
    });
    return CustomerComplaintMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ICustomerComplaint>) {
    return payload;
  },
};

@injectable()
export class CustomerComplaintRepositoryImpl extends PrismaBaseRepositoryImpl<ICustomerComplaint> {
  constructor() {
    super(CustomerComplaintDelegate, customerComplaintMapper);
  }

  async getAll(
    query: ICustomerComplaintRequestQuery,
  ): Promise<PaginatedResponse<ICustomerComplaint>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { complaintCode: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.customerId) where.customerId = query.customerId;
    if (query.complaintTypeId) where.complaintTypeId = query.complaintTypeId;
    if (query.complaintCategoryId)
      where.complaintCategoryId = query.complaintCategoryId;
    if (query.relatedSoftwareId)
      where.relatedSoftwareId = query.relatedSoftwareId;
    if (query.status) where.status = query.status;
    if (query.loggedBy) where.loggedById = query.loggedBy;
    if (query.resolvedBy) where.resolvedById = query.resolvedBy;

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
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          complaintType: true,
          complaintCategory: true,
          relatedSoftware: true,
          loggedBy: true,
          resolvedBy: true,
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

  async getById(id: string): Promise<ICustomerComplaint> {
    const complaint = await this.delegate.findUnique({
      where: { id },
      include: {
        customer: true,
        complaintType: true,
        complaintCategory: true,
        relatedSoftware: true,
        loggedBy: true,
        resolvedBy: true,
      },
    });

    if (!complaint) throw new BadRequestError("Customer complaint not found");
    return this.mapper.toEntity(complaint);
  }

  async create(data: Partial<ICustomerComplaint>): Promise<ICustomerComplaint> {
    const complaintCode = generateModelCode("CMP");
    data.complaintCode = complaintCode;
    const dto = this.mapper.toDtoCreation(data);

    const created = await this.delegate.create({
      data: dto as any,
      include: {
        customer: true,
        complaintType: true,
        complaintCategory: true,
        relatedSoftware: true,
        loggedBy: true,
        resolvedBy: true,
      },
    });
    return this.mapper.toEntity(created);
  }

  async update(
    id: string,
    data: Partial<ICustomerComplaint>,
  ): Promise<ICustomerComplaint> {
    const updated = await this.delegate.update({
      where: { id },
      data: data as any,
      include: {
        customer: true,
        complaintType: true,
        complaintCategory: true,
        relatedSoftware: true,
        loggedBy: true,
        resolvedBy: true,
      },
    });

    if (!updated) throw new BadRequestError("Customer complaint not found");
    return this.mapper.toEntity(updated);
  }
}
