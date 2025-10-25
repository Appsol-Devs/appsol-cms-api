import type { IComplaintType } from "../../../../entities/index.js";
import type { RequestQuery } from "../../../../entities/User.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";

export interface IComplaintTypeInteractor {
  updateComplaintType(
    id: string,
    data: IComplaintType
  ): Promise<IComplaintType>;
  getAllComplaintTypes(
    query: RequestQuery
  ): Promise<PaginatedResponse<IComplaintType>>;
  deleteComplaintType(id: string): Promise<IComplaintType>;
  addComplaintType(data: IComplaintType): Promise<IComplaintType>;
  getAComplaintType(id: string): Promise<IComplaintType>;
}
