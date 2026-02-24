import type {
  ICustomer,
  ICustomerRequestQuery,
} from "../../../../entities/Customer.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import { CustomerModel, CustomerModelMapper } from "../../models/customer.js";
import { injectable } from "inversify";
import { BadRequestError } from "../../../../error_handler/BadRequestError.js";
import type { PaginatedResponse } from "../../../../entities/index.js";
import mongoose from "mongoose";

@injectable()
export class CustomerRepositoryImpl extends BaseRepoistoryImpl<ICustomer> {
  constructor() {
    super(CustomerModel, CustomerModelMapper);
  }

  async getAll(
    query: ICustomerRequestQuery,
  ): Promise<PaginatedResponse<ICustomer>> {
    try {
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
          { email: { $regex: new RegExp(search, "i") } },
        ];
      }

      // ✅ Enum filters
      if (query.status) filter.status = query.status;

      // ✅ Foreign key filters (ObjectId)
      if (query.softwareId)
        filter.software = new mongoose.Types.ObjectId(query.softwareId);
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
          .populate("loggedBy", "firstName lastName email")
          .populate("software", "name description colorCode")
          .skip(skip)
          .limit(limit)
          //sort by name ascending
          .sort({ name: 1 }),
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
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<ICustomer> {
    try {
      const customer = await this.model
        .findById(id)
        .populate("loggedBy", "firstName lastName email")
        .populate("software", "name description colorCode");
      if (!customer) throw new BadRequestError("Customer not found");
      return this.mapper.toEntity(customer);
    } catch (error) {
      throw error;
    }
  }

  // ✅ Override create
  async create(data: Partial<ICustomer>): Promise<ICustomer> {
    try {
      const dataWithReferences = this.assignReferences(data);

      const created = await this.model.create({
        ...data,
        ...dataWithReferences,
      });
      const populated = await created.populate([
        { path: "software", select: "name description colorCode" },
        { path: "loggedBy", select: "firstName lastName email" },
      ]);

      return this.mapper.toEntity(populated);
    } catch (error) {
      throw error;
    }
  }

  // ✅ Override update
  async update(id: string, data: Partial<ICustomer>): Promise<ICustomer> {
    try {
      const dataWithReferences = this.assignReferences(data);
      const updated = await this.model
        .findByIdAndUpdate(
          id,
          { ...data, ...dataWithReferences },
          { new: true },
        )
        .populate("loggedBy", "firstName lastName email")
        .populate("software", "name description colorCode");
      if (!updated) throw new BadRequestError("Customer not found");
      return this.mapper.toEntity(updated);
    } catch (error) {
      throw error;
    }
  }

  private assignReferences(data: Partial<ICustomer>): ICustomer {
    const refs: Partial<ICustomer> = {};
    if (data.softwareId) refs.software = data.softwareId;

    return refs;
  }
}
