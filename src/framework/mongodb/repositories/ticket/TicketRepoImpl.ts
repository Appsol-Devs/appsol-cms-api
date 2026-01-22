import { inject, injectable } from "inversify";

import type { PaginatedResponse } from "../../../../entities/UserResponse.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import type {
  ITicket,
  ITicketRequestQuery,
} from "../../../../entities/Ticket.js";
import {
  CustomerComplaintModel,
  TicketModel,
  TicketModelMapper,
} from "../../models/index.js";
import mongoose from "mongoose";
import { populate } from "dotenv";
import type { ITicketRepo } from "./ITicketRepo.js";

@injectable()
export class TicketRepositoryImpl
  extends BaseRepoistoryImpl<ITicket>
  implements ITicketRepo
{
  constructor() {
    super(TicketModel, TicketModelMapper);
  }
  async closeTicket(id: string): Promise<ITicket> {
    try {
      const session = await mongoose.startSession();

      //find ticket
      const ticket = await TicketModel.findById(id);
      if (!ticket) throw new NotFoundError("Ticket not found");

      // Start a transaction

      await session.withTransaction(async () => {
        // 1. Close the ticket
        await TicketModel.updateOne(
          { _id: ticket._id },
          { $set: { status: "closed", closedAt: new Date() } },
          { session },
        );

        // 2. Resolve the linked complaint
        await CustomerComplaintModel.updateOne(
          { _id: (ticket as any).complaint },
          {
            $set: {
              status: "resolved",
              resolvedAt: new Date(),
            },
          },
          { session },
        );
      });

      await session.endSession();
      // Fetch the updated ticket
      const updatedTicket = await TicketModel.findById(id)
        .populate(
          "assignedEngineer",
          "firstName lastName email phone companyName",
        )
        .populate({
          path: "complaint",
          populate: {
            path: "customer",
            select: "name email phone",
          },
        })
        .populate("loggedBy", "firstName lastName email")
        .populate({
          path: "history",
          populate: {
            path: "from to",
            select: "firstName lastName email phone companyName",
          },
        });

      if (!updatedTicket) throw new NotFoundError("Ticket not found");
      return this.mapper.toEntity(updatedTicket);
    } catch (error) {
      throw error;
    }
  }

  // ✅ Paginated & Filtered fetch
  async getAll(
    query: ITicketRequestQuery,
  ): Promise<PaginatedResponse<ITicket>> {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const filter: Record<string, any> = {};

    // ✅ Text search
    if (search) {
      filter.$or = [{ ticketCode: { $regex: new RegExp(search, "i") } }];
    }

    // ✅ Simple filters
    if (query.assignedEngineerId)
      filter.assignedEngineer = new mongoose.Types.ObjectId(
        query.assignedEngineerId,
      );
    if (query.status) filter.status = query.status;
    if (query.complaintId)
      filter.complaint = new mongoose.Types.ObjectId(query.complaintId);
    if (query.loggedById)
      filter.loggedBy = new mongoose.Types.ObjectId(query.loggedById);
    if (query.priority) filter.priority = query.priority;
    if (query.status) filter.status = query.status;

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
        .populate("assignedEngineer", "firstName lastName email phone ")
        .populate("complaint", "title description complaintCode")
        .populate("loggedBy", "name email phone companyName")
        .populate({
          path: "history",
          populate: {
            path: "from to",
            select: "firstName lastName email phone companyName",
          },
        })
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

  // ✅ Fetch single by ID
  async getById(id: string): Promise<ITicket> {
    const result = await this.model
      .findById(id)
      .populate(
        "assignedEngineer",
        "firstName lastName email phone companyName",
      )
      .populate({
        path: "complaint",
        select: "title description complaintCode",
        populate: {
          path: "customer",
          select: "name email phone companyName",
        },
      })
      .populate("loggedBy", "name email phone companyName")
      .populate({
        path: "history",
        populate: {
          path: "from to",
          select: "firstName lastName email phone companyName",
        },
      });

    if (!result) throw new NotFoundError("Ticket  not found");
    return this.mapper.toEntity(result);
  }

  // ✅ Assign all references directly from IDs
  private assignReferences(data: Partial<ITicket>): ITicket {
    const refs: Partial<ITicket> = {};
    if (data.assignedEngineerId)
      refs.assignedEngineer = data.assignedEngineerId;
    if (data.complaintId) refs.complaint = data.complaintId;
    if (data.loggedBy) refs.loggedBy = data.loggedBy;
    return refs;
  }

  // ✅ Override create
  async create(data: Partial<ITicket>): Promise<ITicket> {
    const dataWithReferences = this.assignReferences(data);

    const created = await this.model.create({ ...data, ...dataWithReferences });
    const populated = await created.populate([
      {
        path: "assignedEngineer",
        select: "firstName lastName email phone companyName",
      },
      {
        path: "complaint",
        select: "title description complaintCode",
        populate: {
          path: "customer",
          select: "name email phone companyName",
        },
      },
      { path: "loggedBy", select: "name email phone companyName" },
      {
        path: "history",
        populate: {
          path: "from to",
          select: "firstName lastName email phone companyName",
        },
      },
    ]);

    return this.mapper.toEntity(populated);
  }

  // ✅ Override update
  async update(id: string, data: Partial<ITicket>): Promise<ITicket> {
    const dataWithReferences = this.assignReferences(data);

    const updated = await this.model
      .findByIdAndUpdate(id, { ...data, ...dataWithReferences }, { new: true })
      .populate(
        "assignedEngineer",
        "firstName lastName email phone companyName",
      )
      .populate({
        path: "complaint",
        select: "title description complaintCode",
        populate: {
          path: "customer",
          select: "name email phone companyName",
        },
      })
      .populate("loggedBy", "name email phone companyName")
      .populate({
        path: "history",
        populate: {
          path: "from to",
          select: "firstName lastName email phone companyName",
        },
      });

    if (!updated) throw new NotFoundError("Ticket Reminder not found");
    return this.mapper.toEntity(updated);
  }

  async findOne(filter: Partial<ITicket>): Promise<ITicket | null | undefined> {
    const result = await this.model
      .findOne(filter)
      .populate(
        "assignedEngineer",
        "firstName lastName email phone companyName",
      )
      .populate({
        path: "complaint",
        select: "title description complaintCode",
        populate: {
          path: "customer",
          select: "name email phone companyName",
        },
      })
      .populate("loggedBy", "name email phone companyName")
      .populate({
        path: "history",
        populate: {
          path: "from to",
          select: "firstName lastName email phone companyName",
        },
      });
    if (!result) return null;
    return this.mapper.toEntity(result);
  }
}
