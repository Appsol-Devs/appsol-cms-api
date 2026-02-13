import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  ICustomerOutreach,
  ICustomerOutreachRequestQuery,
} from "../../../../entities/CustomerOutreach.js";
import {
  CustomerOutreachModel,
  CustomerOutreachModelMapper,
} from "../../models/customerOutreach.js";

@injectable()
export class CustomerOutreachRepositoryImpl extends BaseRepoistoryImpl<ICustomerOutreach> {
  constructor() {
    super(CustomerOutreachModel, CustomerOutreachModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: ICustomerOutreachRequestQuery,
  ): Promise<PaginatedResponse<ICustomerOutreach>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { outreachCode: { $regex: new RegExp(search, "i") } },
        { purpose: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters
    if (query.customerId) filter.customerId = query.customerId;
    if (query.callStatusId) filter.callStatusId = query.callStatusId;
    if (query.status) filter.status = query.status;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;
    if (query.resolvedBy) filter.resolvedBy = query.resolvedBy;
    if (query.outreachTypeId) filter.outreachTypeId = query.outreachTypeId;

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
        .populate("callStatus", "name colorCode")
        .populate("loggedBy", "firstName lastName email")
        .populate("outreachType", "name colorCode")
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
  async getById(id: string): Promise<ICustomerOutreach> {
    const complaint = await this.model
      .findById(id)
      .populate("customer", "name email phone companyName")
      .populate("callStatus", "name colorCode")
      .populate("loggedBy", "firstName lastName email")
      .populate("outreachType", "name colorCode");

    if (!complaint) throw new NotFoundError("Customer outreach not found");
    return this.mapper.toEntity(complaint);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(
    data: Partial<ICustomerOutreach>,
  ): ICustomerOutreach {
    if (data.customerId) data.customer = data.customerId;
    if (data.callStatusId) data.callStatus = data.callStatusId;
    if (data.outreachTypeId) data.outreachType = data.outreachTypeId;
    return data;
  }

  // ✅ Override create
  async create(data: Partial<ICustomerOutreach>): Promise<ICustomerOutreach> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email" },
      { path: "callStatus", select: "name colorCode" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(
    id: string,
    data: Partial<ICustomerOutreach>,
  ): Promise<ICustomerOutreach> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email")
      .populate("callStatus", "name colorCode")
      .populate("loggedBy", "firstName lastName email")
      .populate("outreachType", "name");

    if (!updated) throw new NotFoundError("Customer complaint not found");
    return this.mapper.toEntity(updated);
  }
}
