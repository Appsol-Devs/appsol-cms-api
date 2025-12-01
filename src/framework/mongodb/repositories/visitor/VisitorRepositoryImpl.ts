import { injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";

import { VisitorModel, VisitorModelMapper } from "../../models/index.js";
import mongoose from "mongoose";
import type {
  IVisitor,
  IVisitorRequestQuery,
} from "../../../../entities/index.js";
import { email } from "zod";

@injectable()
export class VisitorRepositoryImpl extends BaseRepoistoryImpl<IVisitor> {
  constructor() {
    super(VisitorModel, VisitorModelMapper);
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: IVisitorRequestQuery
  ): Promise<PaginatedResponse<IVisitor>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [
        { visitorCode: { $regex: new RegExp(search, "i") } },
        { fullName: { $regex: new RegExp(search, "i") } },
        { email: { $regex: new RegExp(search, "i") } },
        { phone: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Simple filters
    if (query.loggedBy)
      filter.loggedBy = new mongoose.Types.ObjectId(query.loggedBy);

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
        .populate("loggedBy", "firstName lastName email phone ")

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
  }
}
