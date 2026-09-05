import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import { IStore, type IStoreRequestQuery } from "../../../../entities/Store.js";
import { generateModelCode } from "../../../../utils/helpers.js";

const StoreDelegate = prisma.store;

const storeMapper = {
  toEntity(record: any): IStore {
    return new IStore(
      record.id,
      record.storeCode,
      record.customerId,
      record.customer,
      record.name,
      record.location,
      record.notes,
      record.status,
      record.loggedById,
      record.createdAt?.toISOString(),
      record.updatedAt?.toISOString(),
    );
  },
  toDtoCreation(payload: Partial<IStore>) {
    return payload as any;
  },
};

@injectable()
export class StoreRepositoryImpl extends PrismaBaseRepositoryImpl<IStore> {
  constructor() {
    super(StoreDelegate, storeMapper);
  }

  async getAll(query: IStoreRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { storeCode: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.customerId) where.customerId = query.customerId;
    if (query.status) where.status = query.status;
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
        include: { customer: true, loggedBy: true },
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
      include: { customer: true, loggedBy: true },
    });
    if (!record) throw new Error("Store not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<IStore>) {
    const storeCode = generateModelCode("STR");
    data.storeCode = storeCode;
    const created = await this.delegate.create({
      data: data as any,
      include: { customer: true, loggedBy: true },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<IStore>) {
    const updated = await this.delegate.update({
      where: { id },
      data: data as any,
      include: { customer: true, loggedBy: true },
    });
    return this.mapper.toEntity(updated);
  }
}
