import { injectable } from "inversify";
import type { RequestQuery } from "../../../entities/User.js";
import type { PaginatedResponse } from "../../../entities/UserResponse.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import { NotFoundError } from "../../../error_handler/NotFoundError.js";
import { UnprocessableEntityError } from "../../../error_handler/UnprocessableEntityError.js";
import type { IBaseRepository } from "../../../framework/mongodb/repositories/base/IBaseRepository.js";
import type { IBaseInteractor } from "./IBaseInteractor.js";

@injectable()
export abstract class BaseInteractorImpl<TDomain>
  implements IBaseInteractor<TDomain>
{
  protected constructor(
    protected readonly repository: IBaseRepository<TDomain>
  ) {
    this.repository = repository;
  }
  getAll(query: RequestQuery): Promise<PaginatedResponse<TDomain>> {
    return this.repository.getAll(query);
  }
  async getById(id: string): Promise<TDomain> {
    const res = await this.repository.getById(id);
    if (!res) throw new NotFoundError("Item not found");
    return res;
  }
  async create(data: TDomain): Promise<TDomain> {
    if (!data) throw new UnprocessableEntityError("Data is required");
    const res = await this.repository.create(data);
    if (!res) throw new BadRequestError("Error creating item");
    return res;
  }
  async update(id: string, data: TDomain): Promise<TDomain> {
    if (!id) throw new UnprocessableEntityError("Id is required");
    if (!data) throw new UnprocessableEntityError("Data is required");
    const item = await this.repository.getById(id);
    if (!item) throw new NotFoundError("Item not found");
    const res = await this.repository.update(id, data);
    if (!res) throw new BadRequestError("Error updating item");
    return res;
  }
  async delete(id: string): Promise<TDomain> {
    const item = await this.repository.getById(id);
    if (!item) throw new NotFoundError("Item not found");
    const res = await this.repository.delete(id);
    if (!res) throw new BadRequestError("Error deleting item");
    return res;
  }
}
