import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  ITicket,
  type ITicketRequestQuery,
} from "../../../../entities/Ticket.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";
import { includes } from "zod";

const TicketDelegate = prisma.ticket;

const ticketMapper = {
  toEntity(record: any): ITicket {
    const TicketMapper = createMapper<ITicket, typeof record>({
      mapIdToLegacyId: true,
    });
    return TicketMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ITicket>) {
    const dto: any = {
      ticketCode: payload.ticketCode,
      title: payload.title,
      requestedDate: payload.requestedDate,
      notes: payload.notes,
      rejectionReason: payload.rejectionReason,
      priority: payload.priority,
      status: payload.status,
      history: payload.history,
      closedAt: payload.closedAt,
    };

    if (payload.complaintId !== undefined) {
      dto.complaint = {
        connect: {
          id: payload.complaintId,
        },
      };
    }

    if (payload.customerId !== undefined) {
      dto.customer = {
        connect: {
          id: payload.customerId,
        },
      };
    }

    if (payload.assignedEngineerId !== undefined) {
      dto.assignedEngineer = {
        connect: {
          id: payload.assignedEngineerId,
        },
      };
    }

    if (payload.loggedBy !== undefined) {
      const loggedById =
        typeof payload.loggedBy === "string"
          ? payload.loggedBy
          : payload.loggedBy.id;

      if (loggedById) {
        dto.loggedBy = {
          connect: {
            id: loggedById,
          },
        };
      }
    }

    return dto;
  },

  toDtoUpdate(payload: Partial<ITicket>) {
    const dto: any = {};

    if (payload.ticketCode !== undefined) {
      dto.ticketCode = payload.ticketCode;
    }

    if (payload.title !== undefined) {
      dto.title = payload.title;
    }

    if (payload.requestedDate !== undefined) {
      dto.requestedDate = payload.requestedDate;
    }

    if (payload.notes !== undefined) {
      dto.notes = payload.notes;
    }

    if (payload.rejectionReason !== undefined) {
      dto.rejectionReason = payload.rejectionReason;
    }

    if (payload.priority !== undefined) {
      dto.priority = payload.priority;
    }

    if (payload.status !== undefined) {
      dto.status = payload.status;
    }

    if (payload.history !== undefined) {
      dto.history = payload.history;
    }

    if (payload.closedAt !== undefined) {
      dto.closedAt = payload.closedAt;
    }

    // Relations

    if (payload.complaintId !== undefined) {
      dto.complaint =
        payload.complaintId === null
          ? { disconnect: true }
          : {
              connect: {
                id: payload.complaintId,
              },
            };
    }

    if (payload.customerId !== undefined) {
      dto.customer =
        payload.customerId === null
          ? { disconnect: true }
          : {
              connect: {
                id: payload.customerId,
              },
            };
    }

    if (payload.assignedEngineerId !== undefined) {
      dto.assignedEngineer =
        payload.assignedEngineerId === null
          ? { disconnect: true }
          : {
              connect: {
                id: payload.assignedEngineerId,
              },
            };
    }

    if (payload.loggedBy !== undefined) {
      const loggedById =
        typeof payload.loggedBy === "string"
          ? payload.loggedBy
          : payload.loggedBy.id;

      if (loggedById) {
        dto.loggedBy = {
          connect: {
            id: loggedById,
          },
        };
      }
    }

    return dto;
  },
};

@injectable()
export class TicketRepositoryImpl extends PrismaBaseRepositoryImpl<ITicket> {
  constructor() {
    super(TicketDelegate, ticketMapper);
  }

  async create(data: Partial<ITicket>): Promise<ITicket> {
    const ticketCode = generateModelCode("TKT");
    data.ticketCode = ticketCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({
      data: dto,
      include: {
        customer: true,
        complaint: true,
        loggedBy: true,
        assignedEngineer: true,
      },
    });
    return this.mapper.toEntity(created);
  }

  async closeTicket(id: string): Promise<ITicket> {
    const ticket = await this.delegate.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundError("Ticket not found");

    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: { status: "closed", closedAt: new Date() },
      });
      await tx.customerComplaint.update({
        where: { id: ticket.complaintId },
        data: { status: "resolved", resolvedAt: new Date() },
      });
    });

    const updated = await this.delegate.findUnique({
      where: { id },
      include: {
        assignedEngineer: true,
        complaint: {
          select: {
            id: true,
            customer: true,
          },
        },
        loggedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    if (!updated) throw new NotFoundError("Ticket not found");
    return this.mapper.toEntity(updated);
  }

  async getAll(query: ITicketRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search)
      where.OR = [{ ticketCode: { contains: search, mode: "insensitive" } }];
    if (query.assignedEngineerId)
      where.assignedEngineerId = query.assignedEngineerId;
    if (query.status) where.status = query.status;
    if (query.complaintId) where.complaintId = query.complaintId;
    if (query.loggedById) where.loggedById = query.loggedById;
    if (query.priority) where.priority = query.priority;

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
          assignedEngineer: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              imageUrl: true,
              email: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
          customer: true,
          complaint: { include: { customer: true } },
          loggedBy: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              imageUrl: true,
              email: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
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
        assignedEngineer: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
            imageUrl: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        customer: true,
        complaint: { include: { customer: true } },
        loggedBy: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
            imageUrl: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!record) throw new NotFoundError("Ticket not found");
    return this.mapper.toEntity(record);
  }

  async findOne(filter: Partial<ITicket>) {
    const record = await this.delegate.findFirst({
      where: filter as any,
      include: {
        assignedEngineer: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
            imageUrl: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        customer: true,
        complaint: { include: { customer: true } },
        loggedBy: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
            imageUrl: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!record) return null;
    return this.mapper.toEntity(record);
  }
}
