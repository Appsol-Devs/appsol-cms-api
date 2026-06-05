import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  ISubscriptionReminder,
  ISubscriptionReminderRequestQuery,
  TSubscriptionReminderType,
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
    query: ISubscriptionReminderRequestQuery,
  ): Promise<PaginatedResponse<ISubscriptionReminder>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // Text search
    if (search) {
      filter.$or = [{ reminderCode: { $regex: new RegExp(search, "i") } }];
    }

    // Simple filters
    if (query.customerId)
      filter.customer = new mongoose.Types.ObjectId(query.customerId);
    if (query.softwareId)
      filter.software = new mongoose.Types.ObjectId(query.softwareId);
    if (query.subscriptionId)
      filter.subscription = new mongoose.Types.ObjectId(query.subscriptionId);
    if (query.isSent !== undefined) filter.isSent = query.isSent;
    if (query.sentVia) filter.sentVia = query.sentVia;

    // Date range filter on nextBillingDate — drives the tab filtering on the frontend
    if (query.filter) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const ranges: Record<
        TSubscriptionReminderType,
        { $gte: Date; $lte: Date }
      > = {
        overdue: {
          $gte: new Date(0), // any past date
          $lte: new Date(now.getTime() - 1), // before today
        },
        due_today: {
          $gte: now,
          $lte: endOfToday,
        },
        "7_days": {
          $gte: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
          $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
        },
        "14_days": {
          $gte: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days ahead
          $lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        },
        "30_days": {
          $gte: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
          $lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      };

      filter.nextBillingDate = ranges[query.filter];
    }

    // Created-at date range (for separate date-based search, unrelated to filter tabs)
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
    data: Partial<ISubscriptionReminder>,
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
    data: Partial<ISubscriptionReminder>,
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
    data: Partial<ISubscriptionReminder>,
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
