import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { ISubscription } from "../../../entities/Subscription.js";

const subscriptionSchema = new Schema({
  subscriptionCode: { type: String, unique: true },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  customerId: {
    type: String,
    required: true,
    index: true,
  },
  software: {
    type: Schema.Types.ObjectId,
    ref: "Software",
    required: true,
  },
  softwareId: {
    type: String,
    required: true,
    index: true,
  },
  subscriptionType: {
    type: Schema.Types.ObjectId,
    ref: "SubscriptionType",
    required: false,
  },
  subscriptionTypeId: {
    type: String,
    required: false,
    index: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled", "pending"],
    default: "pending",
    required: true,
    index: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  currentPeriodStart: {
    type: Date,
    required: true,
    index: true,
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
    index: true,
  },
  nextBillingDate: {
    type: Date,
    required: true,
    index: true,
  },
  lastPaymentId: {
    type: String,
    required: false,
  },
  lastPayment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },
  lastPaymentDate: {
    type: Date,
  },
  amount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  autoRenew: {
    type: Boolean,
    default: true,
  },
  cancelledAt: {
    type: Date,
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cancellationReason: {
    type: String,
  },
  notes: {
    type: String,
  },
  loggedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Compound indexes for efficient queries
subscriptionSchema.index({ customerId: 1, softwareId: 1 });
subscriptionSchema.index({ status: 1, nextBillingDate: 1 });
subscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });

// Prevent duplicate active subscriptions for same customer + software
// subscriptionSchema.index(
//   { customerId: 1, softwareId: 1, status: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { status: "active" },
//   }
// );

export const { Model: SubscriptionModel, Mapper: SubscriptionModelMapper } =
  createModel<ISubscription>(
    "Subscription",
    subscriptionSchema,
    "SUBC",
    "subscriptionCode"
  );
