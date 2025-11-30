import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  ISubscriptionReminder,
  ISubscriptionReminderRequestQuery,
} from "../../../../entities/SubscriptionReminder.js";
import {
  SubscriptionReminderModel,
  SubscriptionReminderModelMapper,
} from "../../models/index.js";
import mongoose from "mongoose";

@injectable()
export class SubscriptionReminderRepositoryImpl extends BaseRepoistoryImpl<ISubscriptionReminder> {
  constructor() {
    super(SubscriptionReminderModel, SubscriptionReminderModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: ISubscriptionReminderRequestQuery
  ): Promise<PaginatedResponse<ISubscriptionReminder>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [{ reminderCode: { $regex: new RegExp(search, "i") } }];
    }

    // ✅ Simple filters
    if (query.customerId)
      filter.customer = new mongoose.Types.ObjectId(query.customerId);
    if (query.status) filter.status = query.status;
    if (query.softwareId)
      filter.software = new mongoose.Types.ObjectId(query.softwareId);
    if (query.reminderType) filter.reminderType = query.reminderType;
    if (query.isSent !== undefined) filter.isSent = query.isSent;
    if (query.sentVia) filter.sentVia = query.sentVia;

    if (query.subscriptionId)
      filter.subscription = new mongoose.Types.ObjectId(query.subscriptionId);

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
        .populate("software", "name description colorCode")
        .populate("payment")
        .populate("subscription")
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

  // ✅ Fetch single by ID
  async getById(id: string): Promise<ISubscriptionReminder> {
    const reminder = await this.model
      .findById(id)
      .populate("customer", "name email phone")
      .populate("payment")
      .populate("software", "name description colorCode")
      .populate("subscription");
    if (!reminder) throw new NotFoundError("Subscription Reminder not found");
    return this.mapper.toEntity(reminder);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(
    data: Partial<ISubscriptionReminder>
  ): ISubscriptionReminder {
    const refs: Partial<ISubscriptionReminder> = {};
    if (data.customerId) refs.customer = data.customerId;
    if (data.softwareId) refs.software = data.softwareId;
    if (data.paymentId) refs.payment = data.paymentId;
    if (data.subscriptionId) refs.subscription = data.subscriptionId;
    return refs;
  }

  // ✅ Override create
  async create(
    data: Partial<ISubscriptionReminder>
  ): Promise<ISubscriptionReminder> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email" },
      { path: "software", select: "name description colorCode" },
      { path: "payment" },
      { path: "subscription" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(
    id: string,
    data: Partial<ISubscriptionReminder>
  ): Promise<ISubscriptionReminder> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email")
      .populate("payment")
      .populate("software", "name description colorCode")
      .populate("subscription");
    if (!updated) throw new NotFoundError("Subscription Reminder not found");
    return this.mapper.toEntity(updated);
  }
}
