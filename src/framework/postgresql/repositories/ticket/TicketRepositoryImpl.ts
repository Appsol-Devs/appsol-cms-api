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

const TicketDelegate = prisma.ticket;

const ticketMapper = {
  toEntity(record: any): ITicket {
    const TicketMapper = createMapper<ITicket, typeof record>({
      mapIdToLegacyId: true,
    });
    return TicketMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ITicket>) {
    return payload as any;
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
    const created = await this.delegate.create({ data: dto });
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
        complaint: { include: { customer: true } },
        loggedBy: true,
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
          assignedEngineer: true,
          complaint: { include: { customer: true } },
          loggedBy: true,
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
        assignedEngineer: true,
        complaint: { include: { customer: true } },
        loggedBy: true,
      },
    });
    if (!record) throw new NotFoundError("Ticket not found");
    return this.mapper.toEntity(record);
  }

  async findOne(filter: Partial<ITicket>) {
    const record = await this.delegate.findFirst({
      where: filter as any,
      include: {
        assignedEngineer: true,
        complaint: { include: { customer: true } },
        loggedBy: true,
      },
    });
    if (!record) return null;
    return this.mapper.toEntity(record);
  }
}
