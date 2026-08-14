import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ILead, ILeadRequestQuery } from "../../../../entities/Lead.js";

const LeadDelegate = prisma.lead;

const leadMapper = {
  toEntity(record: any): ILead {
    return {
      _id: record.id,
      leadCode: record.leadCode,
      name: record.name,
      email: record.email,
      phone: record.phone,
      companyName: record.companyName,
      leadSource: record.leadSource,
      initialEnquiryDate:
        record.initialEnquiryDate && new Date(record.initialEnquiryDate),
      softwareId: record.softwareId,
      software: record.software,
      leadStatus: record.leadStatus,
      loggedBy: record.loggedById,
      createdAt: record.createdAt && new Date(record.createdAt),
      updatedAt: record.updatedAt && new Date(record.updatedAt),
      leadStageId: record.leadStageId,
      priority: record.priority,
      nextStepId: record.nextStepId,
      nextStep: record.nextStep,
      isConverted: record.isConverted,
      location: record.location,
      notes: record.notes,
      geolocation: record.geolocation,
    } as ILead;
  },
  toDtoCreation(payload: Partial<ILead>) {
    const dto: any = {
      name: payload.name,
      email: payload.email,
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
