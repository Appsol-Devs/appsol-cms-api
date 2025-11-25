import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  ICustomerSetup,
  ICustomerSetupRequestQuery,
} from "../../../../entities/CustomerSetup.js";
import {
  CustomerSetupModel,
  CustomerSetupModelMapper,
} from "../../models/customerSetup.js";
import mongoose from "mongoose";

@injectable()
export class CustomerSetupRepositoryImpl extends BaseRepoistoryImpl<ICustomerSetup> {
  constructor() {
    super(CustomerSetupModel, CustomerSetupModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: ICustomerSetupRequestQuery
  ): Promise<PaginatedResponse<ICustomerSetup>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { setupCode: { $regex: new RegExp(search, "i") } },
        { title: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters
    if (query.customerId)
      filter.customerId = new mongoose.Types.ObjectId(query.customerId);
    if (query.priority) filter.priority = query.priority;
    if (query.status) filter.status = query.status;
    if (query.loggedBy)
      filter.loggedBy = new mongoose.Types.ObjectId(query.loggedBy);
    if (query.softwareId) filter.software = query.softwareId;
    if (query.assignedTo)
      filter.assignedTo = {
        $in: query.assignedTo.map((id) => new mongoose.Types.ObjectId(id)),
      };
    if (query.setupStatusId)
      filter.setupStatusId = new mongoose.Types.ObjectId(query.setupStatusId);

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
        .populate("software", "name description colorCode")
        .populate("assignedTo", "firstName lastName email")
        .populate("setupStatus", "name description colorCode")
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
  async getById(id: string): Promise<ICustomerSetup> {
    const request = await this.model
      .findById(id)
      .populate("customer", "name email phone")
      .populate("loggedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("software", "name description colorCode")
      .populate("setupStatus", "name description colorCode");

    if (!request) throw new NotFoundError("Customer Setup not found");
    return this.mapper.toEntity(request);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(data: Partial<ICustomerSetup>): ICustomerSetup {
    const refs: Partial<ICustomerSetup> = {};
    if (data.customerId) refs.customer = data.customerId;
    if (data.softwareId) refs.software = data.softwareId;
    if (data.setupStatusId) refs.setupStatus = data.setupStatusId;

    return refs;
  }

  // ✅ Override create
  async create(data: Partial<ICustomerSetup>): Promise<ICustomerSetup> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email" },
      { path: "loggedBy", select: "firstName lastName email" },
      { path: "software", select: "name description colorCode" },
      { path: "assignedTo", select: "firstName lastName email" },
      { path: "setupStatus", select: "name description colorCode" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(
    id: string,
    data: Partial<ICustomerSetup>
  ): Promise<ICustomerSetup> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email")
      .populate("loggedBy", "firstName lastName email")
      .populate("software", "name description colorCode")
      .populate("assignedTo", "firstName lastName email")
      .populate("setupStatus", "name description colorCode");

    if (!updated) throw new NotFoundError("Customer Setup not found");
    return this.mapper.toEntity(updated);
  }
}
