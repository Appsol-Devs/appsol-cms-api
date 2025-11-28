import type { TPriority } from "../utils/constants/genTypes.js";
import type { ICustomer } from "./Customer.js";
import type { IPayment, ISoftware } from "./index.js";
import type { IUser, RequestQuery } from "./User.js";

export class ISubscriptionReminder {
  constructor(
    public readonly _id?: string,
    public readonly title?: string,
    public readonly message?: string,
    public readonly reminderCode?: string,
    public readonly customerId?: string,
    public readonly paymentId?: string,
    public payment?: IPayment | string,
    public customer?: ICustomer | string,
    public readonly softwareId?: string,
    public software?: ISoftware | string,
    public readonly dueDate?: string,
    public readonly reminderType?: TSubscriptionReminderType,
    public readonly sentDate?: string,
    public readonly isSent?: boolean,
    public readonly sentVia?: "email" | "notification" | "sms",
    public readonly loggedBy?: IUser | string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string
  ) {}
}

export type TSubscriptionReminderType =
  | "30_days"
  | "14_days"
  | "7_days"
  | "due_today"
  | "overdue";

export interface ISubscriptionReminderRequestQuery extends RequestQuery {
  customerId?: string | undefined;
  softwareId?: string | undefined;
  reminderType?: TSubscriptionReminderType | undefined;
  isSent?: boolean | undefined;
  sentVia?: "email" | "notification" | "sms" | undefined;
}
