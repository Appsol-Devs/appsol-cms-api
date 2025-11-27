import type {
  PaginatedResponse,
  RequestQuery,
} from "../../../../entities/index.js";

export interface IBaseRepository<TDomain> {
  getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>>;
  getById(id: string): Promise<TDomain | null | undefined>;
  create(data: TDomain): Promise<TDomain | null | undefined>;
  update(id: string, data: TDomain): Promise<TDomain | null | undefined>;
  delete(id: string): Promise<TDomain | null | undefined>;
  updateMany(
    filter: Partial<TDomain>,
    data: Partial<TDomain>
  ): Promise<number | null | undefined>;
}
