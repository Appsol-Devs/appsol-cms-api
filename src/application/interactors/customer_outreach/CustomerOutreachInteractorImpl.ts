import { inject } from "inversify";
import type { ICustomerOutreach } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerOutreachRepositoryImpl } from "../../../framework/mongodb/repositories/index.js";

export class CustomerOutreachInteractorImpl extends BaseInteractorImpl<ICustomerOutreach> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerOutreachRepositoryImpl)
    customerOutreachRepositoryImpl: CustomerOutreachRepositoryImpl
  ) {
    super(customerOutreachRepositoryImpl);
  }

  async update(
    id: string,
    data: ICustomerOutreach
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
