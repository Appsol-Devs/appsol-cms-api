import { inject } from "inversify";
import type { ICustomer, ICustomerComplaint } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerComplaintRepositoryImpl } from "../../../framework/mongodb/repositories/customer_complaints/index.js";

export class CustomerComplaintInteractorImpl extends BaseInteractorImpl<ICustomerComplaint> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerComplaintRepositoryImpl)
    customerComplaintRepositoryImpl: CustomerComplaintRepositoryImpl
  ) {
    super(customerComplaintRepositoryImpl);
  }

  async update(
    id: string,
    data: ICustomerComplaint
  ): Promise<ICustomerComplaint> {
    if (!id) throw new Error("Id is required");
    if (!data) throw new Error("Data is required");
    const item = await this.repository.getById(id);
    if (!item) throw new Error("CustomerComplaint not found");
    const res = await this.repository.update(id, data);
    if (!res) throw new Error("Error updating item");
    if (res.status === "rescheduled") {
      // TODO: Add to schedular
    }
    return res;
  }
}
