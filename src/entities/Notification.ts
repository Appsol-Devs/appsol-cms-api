import type { ICustomer } from "./Customer.js";
import type { ICustomerComplaint } from "./CustomerComplaint.js";
import type { ICustomerOutreach } from "./CustomerOutreach.js";
import type { TargetEntityType } from "./Reschedule.js";
import type { ISubscriptionReminder } from "./SubscriptionReminder.js";
import type { IUser, RequestQuery } from "./User.js";

export class INotification {
  constructor(
    public readonly _id?: string,
    public readonly notificationCode?: string,
    public readonly targetEntityId?: string,
    public readonly userId?: string,
    public user?: IUser | string,
    public targetEntity?:
      | ICustomerOutreach
      | ICustomerComplaint
      | ISubscriptionReminder
      | string,
    public readonly message?: string,
    public readonly link?: string,
    public readonly isRead?: boolean,
    public readonly targetEntityType?: TargetEntityType,
    public readonly loggedBy?: IUser | string,
    public readonly readAt?: Date | string,
    public readonly createdAt?: Date | string,
    public readonly updatedAt?: Date | string
  ) {}
}

export interface INotificationRequestQuery extends RequestQuery {
  targetEntityType?: TargetEntityType | undefined;
  targetEntityId?: string | undefined;
  isRead?: boolean | undefined;
}
