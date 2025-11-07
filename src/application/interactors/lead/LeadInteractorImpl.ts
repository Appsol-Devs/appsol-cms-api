import { inject } from "inversify";
import type { ICustomer, ILead } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { LeadRepositoryImpl } from "../../../framework/mongodb/repositories/lead/index.js";
import type { CustomerRepositoryImpl } from "../../../framework/mongodb/index.js";

export class LeadInteractorImpl extends BaseInteractorImpl<ILead> {
  constructor(
    @inject(INTERFACE_TYPE.LeadRepositoryImpl)
    leadRepositoryImpl: LeadRepositoryImpl,
    @inject(INTERFACE_TYPE.CustomerRepositoryImpl)
    readonly customerRepository: CustomerRepositoryImpl
  ) {
    super(leadRepositoryImpl);
    this.customerRepository = customerRepository;
  }

  async update(id: string, data: ILead): Promise<ILead> {
    if (!id) throw new Error("Id is required");
    if (!data) throw new Error("Data is required");
    const item = await this.repository.getById(id);
    if (!item) throw new Error("Lead not found");
    const res = await this.repository.update(id, data);
    if (!res) throw new Error("Error updating item");
    if (res.leadStatus === "closed" || res.leadStatus === "won") {
      const customer: ICustomer = {
        name: res.name,
        email: res.email,
        phone: res.phone,
        companyName: res.companyName,
        dateConverted: new Date().toISOString(),
        status: "active",
        loggedBy: res.loggedBy,
        location: res.location,
        notes: res.notes,
        geolocation: res.geolocation,
      };

      await this.customerRepository.create(customer);
    }
    return res;
  }
}
