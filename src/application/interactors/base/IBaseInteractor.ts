import type { RequestQuery } from "../../../entities/User.js";
import type { PaginatedResponse } from "../../../entities/UserResponse.js";

export interface IBaseInteractor<TDomain> {
  getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>>;
  getById(id: string): Promise<TDomain>;
  create(data: TDomain): Promise<TDomain>;
  update(id: string, data: Partial<TDomain>): Promise<TDomain>;
  delete(id: string): Promise<TDomain>;
  updateMany(
    filter?: Partial<TDomain>,
    data?: Partial<TDomain>
  ): Promise<number | null | undefined>;
}
