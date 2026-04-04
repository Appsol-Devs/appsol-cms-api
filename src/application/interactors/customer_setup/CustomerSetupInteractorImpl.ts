import { inject } from "inversify";
import type { ICustomerSetup, IReschedule } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerSetupRepositoryImpl } from "../../../framework/mongodb/repositories/customer_setup/CustomerSetupRepoImpl.js";
import type { IBaseRepository } from "../../../framework/index.js";

export class CustomerSetupInteractorImpl extends BaseInteractorImpl<ICustomerSetup> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerSetupRepositoryImpl)
    customerSetupRepositoryImpl: CustomerSetupRepositoryImpl,
    @inject(INTERFACE_TYPE.RescheduleRepositoryImpl)
    private rescheduleRepository: IBaseRepository<IReschedule>,
  ) {
    super(customerSetupRepositoryImpl);
    this.rescheduleRepository = rescheduleRepository;
  }

  async create(data: ICustomerSetup): Promise<ICustomerSetup> {
    const res = await super.create(data);
    if (res && data.addToCalendar) {
      await this.rescheduleRepository.create({
        customerId: data.customerId,
        targetEntityId: res._id,
        title: data.title,
        targetEntityType: "CustomerSetup",
        reason: data.description || "Initial schedule",
        newDateTime: data.scheduledStart,
        from: data.scheduledStart,
        to: data.scheduledEnd,
        colorCode: "#a855f7",
        originalDateTime: data.scheduledStart,
        status: "pending",
        loggedBy: data.loggedBy,
      });
      return res;
    }
    return res;
  }
}
