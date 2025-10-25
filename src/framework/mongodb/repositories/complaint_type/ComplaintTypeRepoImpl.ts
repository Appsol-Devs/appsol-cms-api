import type {
  IComplaintType,
  PaginatedResponse,
} from "../../../../entities/index.js";
import type { RequestQuery } from "../../../../entities/User.js";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "../../../../error_handler/index.js";
import {
  ComplaintTypeModel,
  ComplaintTypeModelMapper,
} from "../../models/lookups/complaintType.js";
import type { IComplaintTypeRepository } from "./IComplaintTypeRepository.js";
import { injectable } from "inversify";
@injectable()
export class ComplaintTypeRepositoryImpl implements IComplaintTypeRepository {
  async getAllComplaintTypes(
    query: RequestQuery
  ): Promise<PaginatedResponse<IComplaintType>> {
    try {
      const searchQuery = query.search || "";
      const limit = query.pageSize || 10;
      const pageIndex = query.pageIndex || 1;
      const startIndex = (pageIndex - 1) * limit;

      let searchCriteria = {};

      if (searchQuery)
        searchCriteria = {
          searchQuery: searchQuery,
        };

      searchCriteria = {
        ...searchCriteria,
        $or: [
          { name: { $regex: new RegExp(`^${searchQuery}.*`, "i") } },
          { description: { $regex: new RegExp(`^${searchQuery}.*`, "i") } },
        ],
      };

      const roles = await ComplaintTypeModel.find(searchCriteria)
        .limit(limit)
        .skip(startIndex);
      if (roles) {
        const data = roles.map((role) =>
          ComplaintTypeModelMapper.toEntity(role)
        );
        const totalCount: number = await ComplaintTypeModel.countDocuments(
          searchCriteria
        );

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);
        const paginatedRes: PaginatedResponse<IComplaintType> = {
          data,
          totalPages,
          totalCount,
          pageCount: pageIndex,
        };
        return paginatedRes;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw error;
    }
  }
  async getAComplaintType(
    id: string
  ): Promise<IComplaintType | null | undefined> {
    const user = await ComplaintTypeModel.findById(id);
    if (user) {
      return ComplaintTypeModelMapper.toEntity(user);
    } else {
      return null;
    }
  }
  async addComplaintType(
    data: IComplaintType
  ): Promise<IComplaintType | null | undefined> {
    try {
      if (!data)
        throw new UnprocessableEntityError("Complaint Type data is required");
      const newComplaintType = new ComplaintTypeModel(data);
      await newComplaintType.save();
      return ComplaintTypeModelMapper.toEntity(newComplaintType);
    } catch (error) {
      throw error;
    }
  }
  async updateComplaintType(
    id: string,
    data: IComplaintType
  ): Promise<IComplaintType | null | undefined> {
    try {
      const updateComplaintType = await ComplaintTypeModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true,
        }
      );

      if (updateComplaintType) {
        return ComplaintTypeModelMapper.toEntity(updateComplaintType);
      } else {
        throw new NotFoundError("Complaint Type not found");
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteComplaintType(
    id: string
  ): Promise<IComplaintType | null | undefined> {
    try {
      if (!id) throw new UnprocessableEntityError("User id is required");
      const user = await ComplaintTypeModel.findById(id);
      if (!user) throw new NotFoundError("User not found");
      await ComplaintTypeModel.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        }
      );
      return ComplaintTypeModelMapper.toEntity(user);
    } catch (error) {
      throw error;
    }
  }
}
