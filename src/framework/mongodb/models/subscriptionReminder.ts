import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { ISubscriptionReminder } from "../../../entities/SubscriptionReminder.js";

const subscriptionReminderSchema: SchemaDefinition = {
  reminderCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: false },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  softwareId: { type: String, required: true },
  software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
  paymentId: { type: String, required: true },
  payment: { type: Schema.Types.ObjectId, required: false, ref: "Payment" },
  subscriptionId: { type: String, required: false },
  subscription: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Subscription",
  },
  dueDate: { type: Date, required: true },
  isSent: { type: Boolean, required: true, default: false },
  reminderType: {
    type: String,
    required: true,
    default: "30_days",
    enum: ["30_days", "14_days", "7_days", "due_today", "overdue"],
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
