import { inject } from "inversify";
import type {
  IComplaintType,
  ICustomer,
  ICustomerComplaint,
  IUser,
} from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerComplaintRepositoryImpl } from "../../../framework/mongodb/repositories/customer_complaints/index.js";
import type { INotificationService } from "../../../framework/services/index.js";

export class CustomerComplaintInteractorImpl extends BaseInteractorImpl<ICustomerComplaint> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerComplaintRepositoryImpl)
    customerComplaintRepositoryImpl: CustomerComplaintRepositoryImpl,
    @inject(INTERFACE_TYPE.NotificationService)
    private notificationService: INotificationService
  ) {
    super(customerComplaintRepositoryImpl);
    this.notificationService = notificationService;
  }

  async create(data: ICustomerComplaint): Promise<ICustomerComplaint> {
    const res = await super.create(data);
    if (res) {
      await this.notificationService.create({
        userId: res.loggedBy?.toString(),
        message: `A new complaint has been logged (${
          (res.complaintType as IComplaintType).name || res._id
        })`,
        link: `/complaints/${res._id}`,
        targetEntityId: res._id,
      });
      return res;
    }
    return res;
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
    //send updated notification
    await this.notificationService.create({
      userId: (res.loggedBy as IUser)._id,
      message: `Complaint ${res.complaintCode} has been updated (${
        (res.complaintType as IComplaintType).name || res._id
      })`,
      link: `/complaints/${res._id}`,
      targetEntityId: res._id,
      targetEntityType: "CustomerComplaint",
    });
    return res;
  }
}
