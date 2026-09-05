import type { RequestQuery } from "../../../entities/index.js";
import type { PaginatedResponse } from "../../../entities/UserResponse.js";

export interface IBaseLookupRepository<TDomain> {
  getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>>;
  getById(id: string): Promise<TDomain | null | undefined>;
  create(data: TDomain): Promise<TDomain | null | undefined>;
  update(id: string, data: TDomain): Promise<TDomain | null | undefined>;
  delete(id: string): Promise<TDomain | null | undefined>;
}
