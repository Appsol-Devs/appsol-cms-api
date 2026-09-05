import { inject } from "inversify";
import type { ICustomerSetup, IReschedule } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { IBaseRepository } from "../../../domain/repositories/base/IBaseRepository.js";

export class CustomerSetupInteractorImpl extends BaseInteractorImpl<ICustomerSetup> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerSetupRepositoryImpl)
    customerSetupRepository: IBaseRepository<ICustomerSetup>,
    @inject(INTERFACE_TYPE.RescheduleRepositoryImpl)
    private rescheduleRepository: IBaseRepository<IReschedule>,
  ) {
    super(customerSetupRepository as any);
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
