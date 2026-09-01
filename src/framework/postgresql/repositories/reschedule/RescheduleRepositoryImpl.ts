import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  IReschedule,
  type IRescheduleRequestQuery,
} from "../../../../entities/Reschedule.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";

const RescheduleDelegate = prisma.reschedule;

const rescheduleMapper = {
  toEntity(record: any): IReschedule {
    const RescheduleMapper = createMapper<IReschedule, typeof record>({
      mapIdToLegacyId: true,
    });
    return RescheduleMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<IReschedule>) {
    const dto: any = {
      rescheduleCode: payload.rescheduleCode,
      colorCode: payload.colorCode,
      reason: payload.reason,
      title: payload.title,

      originalDateTime: payload.originalDateTime
        ? new Date(payload.originalDateTime)
        : undefined,

      newDateTime: payload.newDateTime
        ? new Date(payload.newDateTime)
        : undefined,

      from: payload.from,
      to: payload.to,
      status: payload.status,
      targetEntityType: payload.targetEntityType,
    };

    if (payload.customerId) {
      dto.customer = {
        connect: { id: payload.customerId },
      };
    }

    if (payload.loggedBy) {
      const loggedById =
        typeof payload.loggedBy === "string"
          ? payload.loggedBy
          : payload.loggedBy._id;

      if (loggedById) {
        dto.loggedBy = {
          connect: { id: loggedById },
        };
      }
    }

    const targetEntityId =
      payload.targetEntityId ??
      (typeof payload.targetEntity === "string"
        ? payload.targetEntity
        : payload.targetEntity?._id);

    // if (targetEntityId) {
    //   switch (payload.targetEntityType) {
    //     case "CustomerOutreach":
    //       dto.customerOutreach = {
    //         connect: { id: targetEntityId },
    //       };
    //       break;

    //     case "CustomerComplaint":
    //       dto.customerComplaint = {
    //         connect: { id: targetEntityId },
    //       };
    //       break;
    //   }
    // }

    return dto;
  },

  toDtoUpdate(payload: Partial<IReschedule>) {
    const dto: any = {
      rescheduleCode: payload.rescheduleCode,
      colorCode: payload.colorCode,
      reason: payload.reason,
      title: payload.title,

      originalDateTime: payload.originalDateTime
        ? new Date(payload.originalDateTime)
        : undefined,

      newDateTime: payload.newDateTime
        ? new Date(payload.newDateTime)
        : undefined,

      from: payload.from,
      to: payload.to,
      status: payload.status,
      targetEntityType: payload.targetEntityType,
    };

    if (payload.customerId !== undefined) {
      dto.customer = payload.customerId
        ? {
            connect: { id: payload.customerId },
          }
        : {
            disconnect: true,
          };
    }

    if (payload.loggedBy !== undefined) {
      const loggedById =
        typeof payload.loggedBy === "string"
          ? payload.loggedBy
          : payload.loggedBy?._id;

      dto.loggedBy = loggedById
        ? {
            connect: { id: loggedById },
          }
        : {
            disconnect: true,
          };
    }

    const targetEntityId =
      payload.targetEntityId ??
      (typeof payload.targetEntity === "string"
        ? payload.targetEntity
        : payload.targetEntity?._id);

    // if (targetEntityId && payload.targetEntityType) {
    //   switch (payload.targetEntityType) {
    //     case "CustomerOutreach":
    //       dto.customerOutreach = {
    //         connect: { id: targetEntityId },
    //       };
    //       break;

    //     case "CustomerComplaint":
    //       dto.customerComplaint = {
    //         connect: { id: targetEntityId },
    //       };
    //       break;
    //   }
    // }

    return dto;
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
        include: {
          customer: true,
          loggedBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              role: { select: { name: true, description: true, id: true } },
            },
          },
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
        loggedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: { select: { name: true, description: true, id: true } },
          },
        },
      },
    });
    if (!record) throw new Error("Schedule not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<IReschedule>) {
    const rescheduleCode = generateModelCode("RS");
    data.rescheduleCode = rescheduleCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({
      data: dto,
      include: {
        customer: true,
        loggedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: { select: { name: true, description: true, id: true } },
          },
        },
      },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<IReschedule>) {
    const dto = this.mapper.toDtoUpdate!(data);
    const updated = await this.delegate.update({
      where: { id },
      data: dto,
      include: {
        customer: true,
        loggedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: { select: { name: true, description: true, id: true } },
          },
        },
      },
    });
    return this.mapper.toEntity(updated);
  }
}
