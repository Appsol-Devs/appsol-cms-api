import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type { IStore, IStoreRequestQuery } from "../../../../entities/Store.js";
import { StoreModel, StoreModelMapper } from "../../models/store.js";

@injectable()
export class StoreRepositoryImpl extends BaseRepoistoryImpl<IStore> {
  constructor() {
    super(StoreModel, StoreModelMapper);
  }

  async getAll(query: IStoreRequestQuery): Promise<PaginatedResponse<IStore>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { storeCode: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
        { location: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (query.customerId) filter.customerId = query.customerId;
    if (query.status) filter.status = query.status;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: query.startDate,
        $lte: query.endDate,
      };
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .populate("customer", "name email phone companyName")
        .populate("loggedBy", "firstName lastName email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.model.countDocuments(filter),
    ]);

    const data = items.map(this.mapper.toEntity);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      totalPages,
      totalCount: total,
      pageCount: pageIndex,
    };
  }

  async getById(id: string): Promise<IStore> {
    const store = await this.model
      .findById(id)
      .populate("customer", "name email phone companyName")
      .populate("loggedBy", "firstName lastName email");
    if (!store) throw new NotFoundError("Store not found");
    return this.mapper.toEntity(store);
  }

  private assignReferences(data: Partial<IStore>): Partial<IStore> {
    const refs: Partial<IStore> = {};
    if (data.customerId) refs.customer = data.customerId;
    if (data.loggedBy) refs.loggedBy = data.loggedBy;
    return refs;
  }

  async create(data: Partial<IStore>): Promise<IStore> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email phone companyName" },
      { path: "loggedBy", select: "firstName lastName email" },
    ]);

    return this.mapper.toEntity(populated);
  }

  async update(id: string, data: Partial<IStore>): Promise<IStore> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email phone companyName")
      .populate("loggedBy", "firstName lastName email");
    if (!updated) throw new NotFoundError("Store not found");
    return this.mapper.toEntity(updated);
  }
}
