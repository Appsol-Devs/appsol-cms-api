import type { RequestQuery } from "../../../../entities/User.js";
import type { PaginatedResponse } from "../../../../entities/UserResponse.js";

export interface IBaseLookupInteractor<TDomain> {
  getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>>;
  getById(id: string): Promise<TDomain>;
  create(data: TDomain): Promise<TDomain>;
  update(id: string, data: TDomain): Promise<TDomain>;
  delete(id: string): Promise<TDomain>;
}
