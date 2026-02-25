import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  ISubscription,
  ISubscriptionRequestQuery,
} from "../../../../entities/Subscription.js";
import {
  SubscriptionModel,
  SubscriptionModelMapper,
} from "../../models/index.js";
import mongoose from "mongoose";

@injectable()
export class SubscriptionRepositoryImpl extends BaseRepoistoryImpl<ISubscription> {
  constructor() {
    super(SubscriptionModel, SubscriptionModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: ISubscriptionRequestQuery,
  ): Promise<PaginatedResponse<ISubscription>> {
    try {
      const search = query.search || "";
      const limit = query.pageSize || 10;
      const pageIndex = query.pageIndex || 1;
      const skip = (pageIndex - 1) * limit;

      const filter: Record<string, any> = {};

      // ✅ Text search
      if (search) {
        filter.$or = [
          { subscriptionCode: { $regex: new RegExp(search, "i") } },
        ];
      }

      // ✅ Simple filters
      if (query.customerId)
        filter.customerId = new mongoose.Types.ObjectId(query.customerId);
      if (query.status) filter.status = query.status;
      if (query.softwareId)
        filter.software = new mongoose.Types.ObjectId(query.softwareId);
      if (query.subscriptionTypeId)
        filter.subscriptionTypeId = new mongoose.Types.ObjectId(
          query.subscriptionTypeId,
        );
      if (query.autoRenew !== undefined) filter.autoRenew = query.autoRenew;

      // ✅ Date range
      if (query.startDate && query.endDate) {
        filter.createdAt = {
          $gte: query.startDate,
          $lte: query.endDate,
        };
      }

      // ✅ Date range
      if (query.currentPeriodStart && query.currentPeriodEnd) {
        filter.currentPeriodStart = {
          $gte: query.currentPeriodStart,
          $lte: query.currentPeriodEnd,
        };
      }

      //renewal date range
      if (query.nextBillingDate) {
        if (query.nextBillingDate.gte) {
          filter.nextBillingDate = {
            $gte: query.nextBillingDate.gte,
          };
        }
        if (query.nextBillingDate.lte) {
          filter.nextBillingDate = {
            $lte: query.nextBillingDate.lte,
          };
        }
      }

      const [items, total] = await Promise.all([
        this.model
          .find(filter)
          .populate("customer", "name email phone companyName")
          .populate("software", "name description colorCode")
          .populate("loggedBy", "firstName lastName email phone ")
          .populate({
            path: "lastPayment",
            select: "-loggedBy -approvedOrRejectedBy",
            populate: [
              { path: "customer", select: "name email phone companyName" },
              { path: "software", select: "name description colorCode" },
              {
                path: "subscriptionType",
                select: "name description colorCode",
              },
            ],
          })
          .populate(
            "subscriptionType",
            "name description colorCode durationInMonths",
          )
          .skip(skip)
          .limit(limit),
        this.model.countDocuments(filter),
      ]);

      const data = items.map((item) => this.mapper.toEntity(item));
      const totalPages = Math.ceil(total / limit);
      return {
        data,
        totalPages,
        totalCount: total,
        pageCount: pageIndex,
      };
    } catch (error) {
      throw error;
    }
  }

  // ✅ Fetch single by ID
  async getById(id: string): Promise<ISubscription> {
    try {
      const reminder = await this.model
        .findById(id)
        .populate("customer", "name email phone companyName")

        .populate("loggedBy", "firstName lastName email phone ")
        .populate({
          path: "lastPayment",
          select: "amount paymentDate paymentCode status",
          populate: [
            { path: "customer", select: "name email phone companyName" },
            { path: "software", select: "name description colorCode" },
            { path: "subscriptionType", select: "name description colorCode" },
          ],
        })
        .populate("software", "name description colorCode")
        .populate(
          "subscriptionType",
          "name description colorCode durationInMonths",
        );

      if (!reminder) throw new NotFoundError("Subscription Reminder not found");
      return this.mapper.toEntity(reminder);
    } catch (error) {
      throw error;
    }
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(data: Partial<ISubscription>): ISubscription {
    const refs: Partial<ISubscription> = {};
    if (data.customerId) refs.customer = data.customerId;
    if (data.softwareId) refs.software = data.softwareId;
    if (data.lastPaymentId) refs.lastPayment = data.lastPaymentId;
    if (data.subscriptionTypeId)
      refs.subscriptionType = data.subscriptionTypeId;
    return refs;
  }

  // ✅ Override create
  async create(data: Partial<ISubscription>): Promise<ISubscription> {
    try {
      const dataWithReferences = this.assignReferences(data);

      const created = await this.model.create({
        ...data,
        ...dataWithReferences,
      });
      const populated = await created.populate([
        { path: "customer", select: "name email phone companyName" },
        { path: "software", select: "name description colorCode" },
        { path: "loggedBy", select: "firstName lastName email phone " },
        {
          path: "lastPayment",
          populate: [
            { path: "customer", select: "name email phone companyName" },
            { path: "software", select: "name description colorCode" },
            { path: "subscriptionType", select: "name description colorCode" },
          ],
        },
        {
          path: "subscriptionType",
          select: "name description colorCode durationInMonths",
        },
      ]);

      return this.mapper.toEntity(populated);
    } catch (error) {
      throw error;
    }
  }

  // ✅ Override update
  async update(
    id: string,
    data: Partial<ISubscription>,
  ): Promise<ISubscription> {
    try {
      const dataWithReferences = this.assignReferences(data);

      const updated = await this.model
        .findByIdAndUpdate(
          id,
          { ...data, ...dataWithReferences },
          { new: true },
        )
        .populate("customer", "name email phone companyName")
        .populate("software", "name description colorCode")
        .populate("loggedBy", "firstName lastName email phone ")
        .populate("lastPayment", {
          path: "lastPayment -loggedBy",
          populate: [
            { path: "customer", select: "name email phone companyName" },
            { path: "software", select: "name description colorCode" },
            { path: "subscriptionType", select: "name description colorCode" },
          ],
        })
        .populate(
          "subscriptionType",
          "name description colorCode durationInMonths",
        );

      if (!updated) throw new NotFoundError("Subscription Reminder not found");
      return this.mapper.toEntity(updated);
    } catch (error) {
      throw error;
    }
  }
}
