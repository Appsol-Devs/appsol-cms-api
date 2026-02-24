import type { Model } from "mongoose";
import type { RequestQuery } from "../../../../entities/User.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import type { IBaseLookupRepository } from "./IBaseLookupRepository.js";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "../../../../error_handler/index.js";
import { injectable } from "inversify";

@injectable()
export abstract class BaseLookupRepoistoryImpl<
  TDomain,
> implements IBaseLookupRepository<TDomain> {
  protected constructor(
    protected readonly model: Model<any>,
    protected readonly mapper: {
      toEntity: (doc: any) => TDomain;
      toDtoCreation: (payload: TDomain) => any;
    },
  ) {}
  async getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>> {
    try {
      const search = query.search || "";
      const limit = query.pageSize || 10;
      const pageIndex = query.pageIndex || 1;
      const skip = (pageIndex - 1) * limit;

      const filter = search
        ? {
            $or: [
              { name: { $regex: new RegExp(`^${search}.*`, "i") } },
              { description: { $regex: new RegExp(`^${search}.*`, "i") } },
            ],
          }
        : {};

      const [items, total] = await Promise.all([
        this.model.find(filter).skip(skip).limit(limit),
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
    } catch (error) {
      throw error;
    }
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
    try {
      const updated = await this.model.findOneAndUpdate(
        { _id: id },
        data as any,
        {
          new: true,
        },
      );
      if (!updated) throw new NotFoundError("Item not found");
      return this.mapper.toEntity(updated);
    } catch (error) {
      throw error;
    }
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
