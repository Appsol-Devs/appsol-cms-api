import { injectable } from "inversify";
import type {
  ICustomerComplaint,
  ICustomerComplaintRequestQuery,
} from "../../../../entities/CustomerComplaint.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import {
  CustomerComplaintModel,
  CustomerComplaintModelMapper,
} from "../../models/customerComplaint.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";

@injectable()
export class CustomerComplaintRepositoryImpl extends BaseRepoistoryImpl<ICustomerComplaint> {
  constructor() {
    super(CustomerComplaintModel, CustomerComplaintModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: ICustomerComplaintRequestQuery
  ): Promise<PaginatedResponse<ICustomerComplaint>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { complaintCode: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters
    if (query.customerId) filter.customerId = query.customerId;
    if (query.complaintTypeId) filter.complaintTypeId = query.complaintTypeId;
    if (query.categoryId) filter.categoryId = query.categoryId;
    if (query.relatedSoftwareId)
      filter.relatedSoftwareId = query.relatedSoftwareId;
    if (query.status) filter.status = query.status;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;
    if (query.resolvedBy) filter.resolvedBy = query.resolvedBy;

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
        .populate("complaintType", "name")
        .populate("category", "name")
        .populate("relatedSoftware", "name version")
        .populate("status", "name colorCode")
        .populate("loggedBy", "firstName lastName email")
        .populate("resolvedBy", "firstName lastName email")
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
  async getById(id: string): Promise<ICustomerComplaint> {
    const complaint = await this.model
      .findById(id)
      .populate("customer", "name email phone")
      .populate("complaintType", "name")
      .populate("category", "name")
      .populate("relatedSoftware", "name version")
      .populate("loggedBy", "firstName lastName email")
      .populate("resolvedBy", "firstName lastName email");

    if (!complaint) throw new NotFoundError("Customer complaint not found");
    return this.mapper.toEntity(complaint);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(
    data: Partial<ICustomerComplaint>
  ): ICustomerComplaint {
    if (data.customerId) data.customer = data.customerId;
    if (data.complaintTypeId) data.complaintType = data.complaintTypeId;
    if (data.categoryId) data.category = data.categoryId;
    if (data.relatedSoftwareId) data.relatedSoftware = data.relatedSoftwareId;
    return data;
  }

  // ✅ Override create
  async create(data: Partial<ICustomerComplaint>): Promise<ICustomerComplaint> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "customer", select: "name email" },
      { path: "complaintType", select: "name" },
      { path: "category", select: "name" },
      { path: "relatedSoftware", select: "name" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(
    id: string,
    data: Partial<ICustomerComplaint>
  ): Promise<ICustomerComplaint> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("customer", "name email")
      .populate("complaintType", "name")
      .populate("category", "name")
      .populate("relatedSoftware", "name")
      .populate("loggedBy", "firstName lastName email")
      .populate("resolvedBy", "firstName lastName email");

    if (!updated) throw new NotFoundError("Customer complaint not found");
    return this.mapper.toEntity(updated);
  }
}
