import type { PaginatedResponse } from "../../../../entities/index.js";
import type { ILead, ILeadRequestQuery } from "../../../../entities/Lead.js";
import { NotFoundError } from "../../../../error_handler/index.js";
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
        .populate("nextStep", "name")
        .populate("loggedBy", "firstName lastName email")
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

  async getById(id: string): Promise<ILead> {
    const lead = await this.model
      .findById(id)
      // .populate("leadStage", "name")
      .populate("nextStep", "name")
      .populate("loggedBy", "firstName lastName email");
    if (!lead) throw new NotFoundError("Lead not found");
    return this.mapper.toEntity(lead);
  }
}
