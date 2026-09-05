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
      leadStatus: payload.leadStatus,
      priority: payload.priority,
      isConverted: payload.isConverted,
      location: payload.location,
      notes: payload.notes,
      geolocation: payload.geolocation,
    };

    if (payload.softwareId !== undefined) {
      dto.software = {
        connect: { id: payload.softwareId },
      };
    }

    if (payload.leadStageId !== undefined) {
      dto.leadStage = {
        connect: { id: payload.leadStageId },
      };
    }

    if (payload.nextStepId !== undefined) {
      dto.nextStep = {
        connect: { id: payload.nextStepId },
      };
    }

    if (payload.loggedById !== undefined) {
      dto.loggedBy = {
        connect: { id: payload.loggedById },
      };
    }

    return dto;
  },

  toDtoUpdate(payload: Partial<ILead>) {
    const dto: any = {};

    if (payload.name !== undefined) {
      dto.name = payload.name;
    }

    if (payload.email !== undefined) {
      dto.email = payload.email;
    }

    if (payload.leadCode !== undefined) {
      dto.leadCode = payload.leadCode;
    }

    if (payload.phone !== undefined) {
      dto.phone = payload.phone;
    }

    if (payload.companyName !== undefined) {
      dto.companyName = payload.companyName;
    }

    if (payload.leadSource !== undefined) {
      dto.leadSource = payload.leadSource;
    }

    if (payload.initialEnquiryDate !== undefined) {
      dto.initialEnquiryDate = payload.initialEnquiryDate;
    }

    if (payload.leadStatus !== undefined) {
      dto.leadStatus = payload.leadStatus;
    }

    if (payload.priority !== undefined) {
      dto.priority = payload.priority;
    }

    if (payload.isConverted !== undefined) {
      dto.isConverted = payload.isConverted;
    }

    if (payload.location !== undefined) {
      dto.location = payload.location;
    }

    if (payload.notes !== undefined) {
      dto.notes = payload.notes;
    }

    if (payload.geolocation !== undefined) {
      dto.geolocation = payload.geolocation;
    }

    // Relations
    if (payload.softwareId !== undefined) {
      dto.software = {
        connect: { id: payload.softwareId },
      };
    }

    if (payload.leadStageId !== undefined) {
      dto.leadStage = {
        connect: { id: payload.leadStageId },
      };
    }

    if (payload.nextStepId !== undefined) {
      dto.nextStep = {
        connect: { id: payload.nextStepId },
      };
    }

    if (payload.loggedBy !== undefined) {
      dto.loggedBy = {
        connect: { id: payload.loggedBy },
      };
    }

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
        include: {
          nextStep: true,
          loggedBy: true,
          software: true,
          // leadStatus: true,
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

  async getById(id: string): Promise<ILead | null | undefined> {
    const record = await this.delegate.findUnique({
      where: { id },
      include: {
        nextStep: true,
        loggedBy: true,
        software: true,
        // leadStatus: true,
      },
    });
    if (!record) throw new Error("Customer Setup not found");
    return this.mapper.toEntity(record);
  }
}
