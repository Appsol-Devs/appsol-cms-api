import type { PaginatedResponse } from "../../../../entities/index.js";
import type { ILead, ILeadRequestQuery } from "../../../../entities/Lead.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../error_handler/index.js";
import { LeadModel, LeadModelMapper } from "../../models/lead.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";

export class LeadRepositoryImpl extends BaseRepoistoryImpl<ILead> {
  constructor() {
    super(LeadModel, LeadModelMapper);
  }

  async getAll(query: ILeadRequestQuery): Promise<PaginatedResponse<ILead>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    // Dynamic filter object
    const filter: Record<string, any> = {};

    // ✅ Text search (name, companyName, location)
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
        { location: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Enum filters
    if (query.leadStatus) filter.leadStatus = query.leadStatus;
    if (query.priority) filter.priority = query.priority;

    // ✅ Foreign key filters (ObjectId)
    if (query.leadStage) filter.leadStage = query.leadStage;
    if (query.nextStep) filter.nextStep = query.nextStep;
    if (query.loggedBy) filter.loggedBy = query.loggedBy;

    // You can extend this to include date filters, etc.
    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: query.startDate,
        $lte: query.endDate,
      };
    }

    // ✅ Fetch with population
    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        //.populate("leadStage", "name")
        .populate("nextStep", "name description colorCode")
        .populate("loggedBy", "firstName lastName email")
        .populate("software", "name description colorCode")
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

  async getById(id: string): Promise<ILead> {
    const lead = await this.model
      .findById(id)
      // .populate("leadStage", "name")
      .populate("nextStep", "name description colorCode")
      .populate("loggedBy", "firstName lastName email")
      .populate("software", "name description colorCode");
    if (!lead) throw new NotFoundError("Lead not found");
    return this.mapper.toEntity(lead);
  }

  // ✅ Override create
  async create(data: Partial<ILead>): Promise<ILead> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      { path: "software", select: "name description colorCode" },
      { path: "nextStep", select: "name description colorCode" },
      { path: "loggedBy", select: "firstName lastName email" },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(id: string, data: Partial<ILead>): Promise<ILead> {
    const dataWithReferences = this.assignReferences(data);
    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate("nextStep", "name description colorCode")
      .populate("loggedBy", "firstName lastName email")
      .populate("software", "name description colorCode");
    if (!updated) throw new BadRequestError("Lead not found");
    return this.mapper.toEntity(updated);
  }

  private assignReferences(data: Partial<ILead>): ILead {
    const refs: Partial<ILead> = {};
    if (data.softwareId) refs.software = data.softwareId;
    return refs;
  }
}
