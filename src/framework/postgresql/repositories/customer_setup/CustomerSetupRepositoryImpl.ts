import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  ICustomerSetup,
  type ICustomerSetupRequestQuery,
} from "../../../../entities/CustomerSetup.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";

const CustomerSetupDelegate = prisma.customerSetup;

const customerSetupMapper = {
  toEntity(record: any): ICustomerSetup {
    const CustomerSetupMapper = createMapper<ICustomerSetup, typeof record>({
      mapIdToLegacyId: true,
    });
    return CustomerSetupMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ICustomerSetup>) {
    const dto: any = {
      setupCode: payload.setupCode,
      title: payload.title,
      customer: { connect: { id: payload.customerId } },
      //customerId: payload.customerId,
      software: { connect: { id: payload.softwareId } },
      // softwareId: payload.softwareId,
      //setupStatusId: payload.setupStatusId,
      setupStatus: { connect: { id: payload.setupStatusId } },
      scheduledStart: payload.scheduledStart,
      scheduledEnd: payload.scheduledEnd,
      actualCompletionDate: payload.actualCompletionDate,
      notes: payload.notes,
      description: payload.description,
      priority: payload.priority,
      status: payload.status,
      loggedBy: { connect: { id: payload.loggedBy } },
      //loggedById: payload.loggedBy as string,
      assignedTo: payload.assignedTo,
      addToCalendar: payload.addToCalendar,
    };
    return dto;
  },
  toDtoUpdate(payload: Partial<ICustomerSetup>) {
    const dto: any = {};

    if (payload.setupCode !== undefined) {
      dto.setupCode = payload.setupCode;
    }

    if (payload.title !== undefined) {
      dto.title = payload.title;
    }

    if (payload.customerId !== undefined) {
      dto.customer = {
        connect: { id: payload.customerId },
      };
    }

    if (payload.softwareId !== undefined) {
      dto.software = {
        connect: { id: payload.softwareId },
      };
    }

    if (payload.setupStatusId !== undefined) {
      dto.setupStatus = {
        connect: { id: payload.setupStatusId },
      };
    }

    if (payload.scheduledStart !== undefined) {
      dto.scheduledStart = payload.scheduledStart;
    }

    if (payload.scheduledEnd !== undefined) {
      dto.scheduledEnd = payload.scheduledEnd;
    }

    if (payload.actualCompletionDate !== undefined) {
      dto.actualCompletionDate = payload.actualCompletionDate;
    }

    if (payload.notes !== undefined) {
      dto.notes = payload.notes;
    }

    if (payload.description !== undefined) {
      dto.description = payload.description;
    }

    if (payload.priority !== undefined) {
      dto.priority = payload.priority;
    }

    if (payload.status !== undefined) {
      dto.status = payload.status;
    }

    if (payload.loggedBy !== undefined) {
      dto.loggedBy = {
        connect: { id: payload.loggedBy },
      };
    }

    // Replace the current assignees with the supplied list
    if (payload.assignedTo !== undefined) {
      dto.assignedTo = {
        set: payload.assignedTo.map((userId) => ({
          id: userId,
        })),
      };
    }

    if (payload.addToCalendar !== undefined) {
      dto.addToCalendar = payload.addToCalendar;
    }

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
        include: {
          customer: true,
          loggedBy: true,
          software: true,
          setupStatus: true,
          assignedTo: true,
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
        loggedBy: true,
        software: true,
        setupStatus: true,
        assignedTo: true,
      },
    });
    if (!record) throw new Error("Customer Setup not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<ICustomerSetup>) {
    const setupCode = generateModelCode("SET");
    data.setupCode = setupCode;
    const dto = this.mapper.toDtoCreation(data);
    const { assignedTo, ...rest } = dto;
    const created = await this.delegate.create({
      data: {
        ...rest,
        ...(assignedTo !== undefined && {
          assignedTo: {
            connect: assignedTo.map((userId: string) => ({
              id: userId,
            })),
          },
        }),
      },

      include: {
        customer: true,
        loggedBy: true,
        software: true,
        setupStatus: true,
        assignedTo: true,
      },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<ICustomerSetup>) {
    const updated = await this.delegate.update({
      where: { id },
      data: this.mapper.toDtoUpdate!(data),
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
