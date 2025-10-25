import type { IComplaintType } from "../../../../entities/lookups/ComplaintType.js";
import type { RequestQuery } from "../../../../entities/User.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";

export interface IComplaintTypeRepository {
  getAllComplaintTypes(
    query: RequestQuery
  ): Promise<PaginatedResponse<IComplaintType>>;
  getAComplaintType(id: string): Promise<IComplaintType | null | undefined>;
  addComplaintType(
    data: IComplaintType
  ): Promise<IComplaintType | null | undefined>;
  updateComplaintType(
    id: string,
    data: IComplaintType
  ): Promise<IComplaintType | null | undefined>;
  deleteComplaintType(id: string): Promise<IComplaintType | null | undefined>;
}
