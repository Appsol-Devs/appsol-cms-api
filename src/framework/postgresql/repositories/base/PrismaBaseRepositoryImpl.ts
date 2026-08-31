import type { IBaseRepository } from "../../../../domain/repositories/index.js";
import type {
  PaginatedResponse,
  RequestQuery,
} from "../../../../entities/index.js";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "../../../../error_handler/index.js";
import { injectable } from "inversify";

export type Mapper<TDomain> = {
  toEntity: (record: any) => TDomain;
  toDtoCreation: (payload: Partial<TDomain>) => any;
  toDtoUpdate?: (payload: Partial<TDomain>) => any;
};

@injectable()
export abstract class PrismaBaseRepositoryImpl<
  TDomain,
> implements IBaseRepository<TDomain> {
  constructor(
    protected readonly delegate: any,
    protected readonly mapper: Mapper<TDomain>,
  ) {}

  async getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>> {
    const limit = query.pageSize ?? 10;
    const pageIndex = query.pageIndex ?? 1;
    const skip = (pageIndex - 1) * limit;

    const items = await this.delegate.findMany({ skip, take: limit });
    const total = await this.delegate.count();

    return {
      data: items.map(this.mapper.toEntity),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageCount: pageIndex,
    };
  }

  async getById(id: string): Promise<TDomain | null | undefined> {
    const record = await this.delegate.findUnique({ where: { id } });
    if (!record) throw new NotFoundError("Item not found");
    return this.mapper.toEntity(record);
  }

  async create(data: TDomain): Promise<TDomain | null | undefined> {
    const dto = this.mapper.toDtoCreation(data as Partial<TDomain>);
    const created = await this.delegate.create({ data: dto });
    return this.mapper.toEntity(created);
  }

  async update(
    id: string,
    data: Partial<TDomain>,
  ): Promise<TDomain | null | undefined> {
    const updated = await this.delegate.update({
      where: { id },
      data: data as any,
    });

    if (!updated) throw new NotFoundError("Item not found");
    return this.mapper.toEntity(updated);
  }

  async delete(id: string): Promise<TDomain | null | undefined> {
    if (!id) throw new UnprocessableEntityError("Id is required");
    const deleted = await this.delegate.delete({ where: { id } });
    return this.mapper.toEntity(deleted);
  }

  async updateMany(
    filter: Partial<TDomain>,
    data: Partial<TDomain>,
  ): Promise<number | null | undefined> {
    if (!filter || Object.keys(filter as any).length === 0) {
      throw new UnprocessableEntityError("Filter is required");
    }

    const result = await this.delegate.updateMany({ where: filter, data });
    return result?.count ?? null;
  }

  async findOne(filter: Partial<TDomain>): Promise<TDomain | null | undefined> {
    if (!filter || Object.keys(filter as any).length === 0) {
      throw new UnprocessableEntityError("Filter is required");
    }

    const record = await this.delegate.findFirst({ where: filter });
    return record ? this.mapper.toEntity(record) : null;
  }
}
