import { inject } from "inversify";
import type { ICustomer, ILead } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { LeadRepositoryImpl } from "../../../framework/mongodb/repositories/lead/index.js";
import type {
  CustomerRepositoryImpl,
  SubscriptionRepositoryImpl,
} from "../../../framework/mongodb/index.js";
import type { ILeadInteractor } from "./ILeadInteractor.js";

export class LeadInteractorImpl
  extends BaseInteractorImpl<ILead>
  implements ILeadInteractor
{
  constructor(
    @inject(INTERFACE_TYPE.LeadRepositoryImpl)
    leadRepositoryImpl: LeadRepositoryImpl,
    @inject(INTERFACE_TYPE.CustomerRepositoryImpl)
    readonly customerRepository: CustomerRepositoryImpl,
    @inject(INTERFACE_TYPE.SubscriptionRepositoryImpl)
    readonly subscriptionRepository: SubscriptionRepositoryImpl,
  ) {
    super(leadRepositoryImpl);
    this.customerRepository = customerRepository;
    this.subscriptionRepository = subscriptionRepository;
  }
  async convertLead(id: string): Promise<ILead> {
    if (!id) throw new Error("Id is required");
    const item = await this.repository.getById(id);
    if (!item) throw new Error("Lead not found");
    const res = await this.repository.update(id, {
      leadStatus: "closed",
      isConverted: true,
    });
    if (!res) throw new Error("Error updating item");

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
      softwareId: res.softwareId,
      leadId: res._id,
    };

    const newCustomer = await this.customerRepository.create(customer);
    if (newCustomer) {
      const startDate = new Date();
      const currentPeriodStart = new Date(startDate);
      const currentPeriodEnd = new Date(startDate);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      await this.subscriptionRepository.create({
        customerId: newCustomer._id,
        softwareId: customer.softwareId,
        nextBillingDate: new Date(currentPeriodEnd),
        currentPeriodStart,
        currentPeriodEnd,
        startDate: startDate,
        loggedBy: res.loggedBy as string,
        status: "active",
      });
    }

    return res;
  }

  async update(id: string, data: ILead): Promise<ILead> {
    if (!id) throw new Error("Id is required");
    if (!data) throw new Error("Data is required");
    const item = await this.repository.getById(id);
    if (!item) throw new Error("Lead not found");
    const res = await this.repository.update(id, data);
    if (!res) throw new Error("Error updating item");
    return res;
  }
}
