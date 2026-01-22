import type { Model } from "mongoose";
import type { RequestQuery } from "../../../../entities/User.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import type { IBaseRepository } from "./IBaseRepository.js";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "../../../../error_handler/index.js";
import { injectable } from "inversify";

@injectable()
export abstract class BaseRepoistoryImpl<
  TDomain,
> implements IBaseRepository<TDomain> {
  protected constructor(
    protected readonly model: Model<any>,
    protected readonly mapper: {
      toEntity: (doc: any) => TDomain;
      toDtoCreation: (payload: TDomain) => any;
    },
  ) {}

  async findOne(filter: Partial<TDomain>): Promise<TDomain | null | undefined> {
    try {
      if (!filter || Object.keys(filter as any).length === 0) {
        throw new UnprocessableEntityError("Filter is required");
      }

      const doc = await this.model.findOne(filter as any);
      if (!doc) return {} as TDomain;
      return this.mapper.toEntity(doc);
    } catch (error) {
      throw error;
    }
  }

  async updateMany(
    filter: Partial<TDomain>,
    data: Partial<TDomain>,
  ): Promise<number | null | undefined> {
    try {
      if (!filter || Object.keys(filter as any).length === 0) {
        throw new UnprocessableEntityError("Filter is required");
      }

      const result = await this.model.updateMany(filter as any, data as any);

      // Mongoose versions may return different shapes; prefer modern `modifiedCount`
      const modifiedCount =
        (result as any).modifiedCount ??
        (result as any).nModified ??
        (result as any).n ??
        null;

      return typeof modifiedCount === "number" ? modifiedCount : null;
    } catch (error) {
      throw error;
    }
  }
  async getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = search
      ? {
          $or: [
            { name: { $regex: new RegExp(`^${search}.*`, "i") } },
            { description: { $regex: new RegExp(`^${search}.*`, "i") } },
          ],
        }
      : {};

    if (query.status) filter.status = query.status;

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: query.startDate,
        $lte: query.endDate,
      };
    }

    if (query.createdBy) filter.createdBy = query.createdBy;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        // .populate("createdBy", "firstName lastName email")
        .populate("loggedBy", "firstName lastName email"),
      this.model.countDocuments(filter),
    ]);

    const data = items.map(this.mapper.toEntity);
    const totalPages = Math.ceil(total / limit);
    const totalCount = total;

    return {
      data,
      totalPages,
      totalCount,
      pageCount: pageIndex,
    };
  }
  async getById(id: string): Promise<TDomain | null | undefined> {
    try {
      const doc = await this.model.findById(id);
      if (!doc) throw new NotFoundError("Item not found");
      return this.mapper.toEntity(doc);
    } catch (error) {
      throw error;
    }
  }
  async create(data: TDomain): Promise<TDomain | null | undefined> {
    try {
      const dto = this.mapper.toDtoCreation(data);

      const created = await this.model.create(dto);
      return this.mapper.toEntity(created);
    } catch (error) {
      throw error;
    }
  }
  async update(
    id: string,
    data: Partial<TDomain>,
  ): Promise<TDomain | null | undefined> {
    const updated = await this.model.findOneAndUpdate(
      { _id: id },
      data as any,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundError("Item not found");
    return this.mapper.toEntity(updated);
  }
  async delete(id: string): Promise<TDomain | null | undefined> {
    try {
      if (!id) throw new UnprocessableEntityError("Id is required");
      const user = await this.model.findById(id);
      if (!user) throw new NotFoundError("Item not found");
      await this.model.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        },
      );
      return this.mapper.toEntity(user);
    } catch (error) {
      throw error;
    }
  }
}
