import { inject } from "inversify";
import type { ICustomerOutreach } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { IBaseRepository } from "../../../domain/repositories/base/IBaseRepository.js";

export class CustomerOutreachInteractorImpl extends BaseInteractorImpl<ICustomerOutreach> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerOutreachRepositoryImpl)
    customerOutreachRepository: IBaseRepository<ICustomerOutreach>,
  ) {
    super(customerOutreachRepository as any);
  }

  async update(
    id: string,
    data: ICustomerOutreach,
  ): Promise<ICustomerOutreach> {
    if (!id) throw new Error("Id is required");
    if (!data) throw new Error("Data is required");
    const item = await this.repository.getById(id);
    if (!item) throw new Error("CustomerOutreach not found");
    const res = await this.repository.update(id, data);
    if (!res) throw new Error("Error updating item");
    if (res.status === "rescheduled") {
      // TODO: Add to schedular
    }
    return res;
  }
}
