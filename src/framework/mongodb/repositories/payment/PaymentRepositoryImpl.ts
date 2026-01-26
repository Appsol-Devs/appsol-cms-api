import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  IPayment,
  IPaymentRequestQuery,
} from "../../../../entities/Payment.js";
import { PaymentModel, PaymentModelMapper } from "../../models/payment.js";

@injectable()
export class PaymentRepositoryImpl extends BaseRepoistoryImpl<IPayment> {
  constructor() {
    super(PaymentModel, PaymentModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: IPaymentRequestQuery,
  ): Promise<PaginatedResponse<IPayment>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { paymentCode: { $regex: new RegExp(search, "i") } },
        { approvalNotes: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters
    if (query.customerId) filter.customerId = query.customerId;
    if (query.subscriptionTypeId)
      filter.subscriptionTypeId = query.subscriptionTypeId;

    if (query.status) filter.status = query.status;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;
    if (query.paymentDate) filter.paymentDate = query.paymentDate;
    // if (query.renewalDate) filter.renewalDate = query.renewalDate;

    // ✅ Date range
    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: query.startDate,
        $lte: query.endDate,
      };
    }

    //renewal date range
    if (query.renewalDate) {
      const { gte, lte } = query.renewalDate;

      if (gte !== undefined || lte !== undefined) {
        filter.renewalDate = {};

        if (gte !== undefined) {
          filter.renewalDate.$gte = gte;
        }

        if (lte !== undefined) {
          filter.renewalDate.$lte = lte;
        }
      }
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .populate("customer", "name email phone companyName")
        .populate("loggedBy", "firstName lastName email")
        .populate(
          "subscriptionType",
          "name description colorCode durationInMonths",
        )
        .populate("approvedOrRejectedBy", "firstName lastName email")
        .populate("software", "name description")
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(filter),
    ]);

    const data = items.map(this.mapper.toEntity);
    const totalPages = Math.ceil(total / limit);
    // get total sum of amount field both pending and approved payments
    const results = await this.model.aggregate([
      {
        $match: { ...filter },
      },
      {
        $group: {
          _id: null,
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0],
            },
          },
          totalApproved: {
            $sum: {
              $cond: [{ $eq: ["$status", "approved"] }, "$amount", 0],
            },
          },
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalPending = results[0]?.totalPending || 0;
    const totalApproved = results[0]?.totalApproved || 0;
    const totalAmount = results[0]?.totalAmount || 0;

    return {
      data,
      totalPages,
      totalCount: total,
      pageCount: pageIndex,
      totalSum: totalAmount || 0,
      totalPending: totalPending || 0,
      totalApproved: totalApproved || 0,
    };
  }

  // ✅ Fetch single complaint
  async getById(id: string): Promise<IPayment> {
    const complaint = await this.model
      .findById(id)
      .populate("customer", "name email phone companyName")
      .populate("loggedBy", "firstName lastName email")
      .populate("approvedOrRejectedBy", "firstName lastName email")
      .populate("software", "name description ")
      .populate(
        "subscriptionType",
        "name description colorCode durationInMonths",
      );

    if (!complaint) throw new NotFoundError("Payment not found");
    return this.mapper.toEntity(complaint);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(data: Partial<IPayment>): IPayment {
    if (data.customerId) data.customer = data.customerId;
    if (data.subscriptionTypeId)
      data.subscriptionType = data.subscriptionTypeId;
    if (data.softwareId) data.software = data.softwareId;
    return data;
  }

  // ✅ Override create
  async create(data: Partial<IPayment>): Promise<IPayment> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email companyName" },
      { path: "loggedBy", select: "firstName lastName email" },
      { path: "subscriptionType", select: "name description colorCode" },
      { path: "approvedOrRejectedBy", select: "firstName lastName email" },
      { path: "software", select: "name description" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(id: string, data: Partial<IPayment>): Promise<IPayment> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email companyName")
      .populate("loggedBy", "firstName lastName email")
      .populate("approvedOrRejectedBy", "firstName lastName email")
      .populate(
        "subscriptionType",
        "name description colorCode durationInMonths",
      );

    if (!updated) throw new NotFoundError("Payment not found");
    return this.mapper.toEntity(updated);
  }
}
