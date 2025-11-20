import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  IReschedule,
  IRescheduleRequestQuery,
} from "../../../../entities/Reschedule.js";
import {
  RescheduleModel,
  RescheduleModelMapper,
} from "../../models/reschedule.js";

@injectable()
export class RescheduleRepositoryImpl extends BaseRepoistoryImpl<IReschedule> {
  constructor() {
    super(RescheduleModel, RescheduleModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: IRescheduleRequestQuery
  ): Promise<PaginatedResponse<IReschedule>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { rescheduleCode: { $regex: new RegExp(search, "i") } },
        { reason: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters
    if (query.customerId) filter.customerId = query.customerId;
    if (query.targetEntityType)
      filter.targetEntityType = query.targetEntityType;
    if (query.targetEntityId) filter.targetEntityId = query.targetEntityId;
    if (query.status) filter.status = query.status;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;
    if (query.originalDateTime)
      filter.originalDateTime = query.originalDateTime;
    if (query.newDateTime) filter.newDateTime = query.newDateTime;

    // ✅ Date range
    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: query.startDate,
        $lte: query.endDate,
      };
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .populate("customer", "name email phone")
        .populate("loggedBy", "firstName lastName email")
        .populate("targetEntityId")
        .skip(skip)
        .limit(limit),
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

  // ✅ Fetch single complaint
  async getById(id: string): Promise<IReschedule> {
    const complaint = await this.model
      .findById(id)
      .populate("customer", "name email phone")
      .populate("loggedBy", "firstName lastName email")
      .populate("targetEntityId");

    if (!complaint) throw new NotFoundError("Reschedule not found");
    return this.mapper.toEntity(complaint);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(data: Partial<IReschedule>): IReschedule {
    if (data.customerId) data.customer = data.customerId;
    if (data.targetEntityId) data.targetEntity = data.targetEntityId;
    return data;
  }

  // ✅ Override create
  async create(data: Partial<IReschedule>): Promise<IReschedule> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email" },
      { path: "loggedBy", select: "firstName lastName email" },
      { path: "targetEntity" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(id: string, data: Partial<IReschedule>): Promise<IReschedule> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email")
      .populate("loggedBy", "firstName lastName email")
      .populate("targetEntity");

    if (!updated) throw new NotFoundError("Customer complaint not found");
    return this.mapper.toEntity(updated);
  }
}
