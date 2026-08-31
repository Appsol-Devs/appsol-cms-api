import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ILead, ILeadRequestQuery } from "../../../../entities/Lead.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";

const LeadDelegate = prisma.lead;

const leadMapper = {
  toEntity(record: any): ILead {
    const LeadMapper = createMapper<ILead, typeof record>({
      mapIdToLegacyId: true,
    });
    return LeadMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ILead>) {
    const dto: any = {
      name: payload.name,
      email: payload.email,
      leadCode: payload.leadCode,
      phone: payload.phone,
      companyName: payload.companyName,
      leadSource: payload.leadSource,
      initialEnquiryDate: payload.initialEnquiryDate,
      softwareId: payload.softwareId,
      leadStatus: payload.leadStatus,
      loggedById: payload.loggedBy as string,
      leadStageId: payload.leadStageId,
      priority: payload.priority,
      nextStepId: payload.nextStepId,
      isConverted: payload.isConverted,
      location: payload.location,
      notes: payload.notes,
      geolocation: payload.geolocation,
    };
    return dto;
  },
};

@injectable()
export class LeadRepositoryImpl extends PrismaBaseRepositoryImpl<ILead> {
  constructor() {
    super(LeadDelegate, leadMapper);
  }

  async create(data: Partial<ILead>): Promise<ILead> {
    const leadCode = generateModelCode("LD");
    data.leadCode = leadCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }

  async getAll(query: ILeadRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    if (query.leadStatus) where.leadStatus = query.leadStatus;
    if (query.priority) where.priority = query.priority;
    if (query.softwareId) where.softwareId = query.softwareId;
    if (query.nextStep) where.nextStepId = query.nextStep;
    if (query.loggedBy) where.loggedById = query.loggedBy;
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
        include: { nextStep: true, loggedBy: true, software: true },
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
}
