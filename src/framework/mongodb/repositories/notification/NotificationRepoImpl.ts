import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  INotification,
  INotificationRequestQuery,
} from "../../../../entities/Notification.js";
import {
  NotificationModel,
  NotificationModelMapper,
} from "../../models/notification.js";
import mongoose from "mongoose";

@injectable()
export class NotificationRepositoryImpl extends BaseRepoistoryImpl<INotification> {
  constructor() {
    super(NotificationModel, NotificationModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: INotificationRequestQuery
  ): Promise<PaginatedResponse<INotification>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { notificationCode: { $regex: new RegExp(search, "i") } },
        { message: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters

    if (query.targetEntityType)
      filter.targetEntityType = query.targetEntityType;
    if (query.targetEntityId)
      filter.targetEntityId = new mongoose.Types.ObjectId(query.targetEntityId);
    if (query.status) filter.status = query.status;
    if (query.isRead) filter.isRead = query.isRead;

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
        .populate("user", "firstName lastName email phone")
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
  async getById(id: string): Promise<INotification> {
    const notification = await this.model
      .findById(id)
      .populate("user", "name email phone")
      .populate("targetEntityId");

    if (!notification) throw new NotFoundError("Notification not found");
    return this.mapper.toEntity(notification);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(data: Partial<INotification>): INotification {
    if (data.userId) data.user = data.userId;
    if (data.targetEntityId) data.targetEntity = data.targetEntityId;
    return data;
  }

  // ✅ Override create
  async create(data: Partial<INotification>): Promise<INotification> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "user", select: "firstName lastName phone email" },
      { path: "targetEntity" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(
    id: string,
    data: Partial<INotification>
  ): Promise<INotification> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("user", "firstName lastName email phone")
      .populate("targetEntity");

    if (!updated) throw new NotFoundError("Notification not found");
    return this.mapper.toEntity(updated);
  }
}
