import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { ISubscriptionReminder } from "../../../entities/SubscriptionReminder.js";

/**
 *  public readonly customerId?: string,
     public customer?: ICustomer | string,
     public readonly softwareId?: string,
     public software?: ISoftware | string,
     public readonly dueDate?: string,
     public readonly reminderType?: "30_days" | "7_days" | "overdue",
     public readonly sentDate?: string,
     public readonly isSent?: boolean,
     public readonly sentVia?: "email" | "notification" | "sms",
     public readonly loggedBy?: IUser | string,
 */

const subscriptionReminderSchema: SchemaDefinition = {
  reminderCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  softwareId: { type: String, required: true },
  software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
  dueDate: { type: Date, required: true },
  reminderDate: { type: Date, required: true },
  isSent: { type: Boolean, required: true, default: false },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  reminderType: {
    type: String,
    required: true,
    default: "30_days",
    enum: ["30_days", "14_days", "7_days", "overdue"],
  },
  sentVia: {
    type: String,
    required: true,
    default: "email",
    enum: ["email", "notification", "sms"],
  },
};

export const {
  Model: SubscriptionReminderModel,
  Mapper: SubscriptionReminderModelMapper,
} = createModel<ISubscriptionReminder>(
  "SubscriptionReminder",
  subscriptionReminderSchema,
  "SRMC",
  "reminderCode"
);
