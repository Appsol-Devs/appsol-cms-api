import { ICustomer } from "../../../../entities/Customer.js";
import type { ICustomerRequestQuery } from "../../../../entities/Customer.js";
import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { injectable } from "inversify";
import { prisma } from "../../utils/prisma.js";
import { BadRequestError } from "../../../../error_handler/BadRequestError.js";
import type { PaginatedResponse } from "../../../../entities/index.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";

const CustomerDelegate = prisma.customer;

const customerMapper = {
  toEntity(record: any): ICustomer {
    const CustomerMapper = createMapper<ICustomer, typeof record>({
      mapIdToLegacyId: true,
    });
    return CustomerMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<ICustomer>) {
    const payloadAny = payload as any;
    const dto: any = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      companyName: payload.companyName,
      dateConverted: payload.dateConverted,
      status: payload.status,
      loggedById: payload.loggedBy as string,
      softwareId: payload.softwareId,
      leadId: payload.leadId,
      location: payload.location,
      notes: payload.notes,
      geolocation: payload.geolocation,
      image: payload.image,
    };

    if (payloadAny.customerCode) {
      dto.customerCode = payloadAny.customerCode;
    }

    return dto;
  },
};

@injectable()
export class CustomerRepositoryImpl extends PrismaBaseRepositoryImpl<ICustomer> {
  constructor() {
    super(CustomerDelegate, customerMapper);
  }

  async getAll(
    query: ICustomerRequestQuery,
  ): Promise<PaginatedResponse<ICustomer>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.status) filter.status = query.status;
    if (query.softwareId) filter.softwareId = query.softwareId;
    if (query.loggedBy) filter.loggedById = query.loggedBy;

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        skip,
        take: limit,
        where: filter,
        orderBy: { name: "asc" },
        include: {
          software: true,
          loggedBy: true,
        },
      }),
      this.delegate.count({ where: filter }),
    ]);

    console.log(items);

    return {
      data: items.map(this.mapper.toEntity),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageCount: pageIndex,
    };
  }

  async getById(id: string): Promise<ICustomer> {
    const customer = await this.delegate.findUnique({
      where: { id },
      include: {
        software: true,
        loggedBy: true,
      },
    });
    if (!customer) throw new BadRequestError("Customer not found");
    return this.mapper.toEntity(customer);
  }

  async create(data: Partial<ICustomer>): Promise<ICustomer> {
    const customerCode = generateModelCode("CU");
    data.customerCode = customerCode;
    const dto = this.mapper.toDtoCreation(data);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<ICustomer>): Promise<ICustomer> {
    const updated = await this.delegate.update({
      where: { id },
      data: data as any,
    });
    if (!updated) throw new BadRequestError("Customer not found");
    return this.mapper.toEntity(updated);
  }
}
