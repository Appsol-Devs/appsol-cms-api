import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { IPayment } from "../../../entities/Payment.js";

const paymentSchema: SchemaDefinition = {
  paymentCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  softwareId: { type: String, required: true },
  software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
  approvalNotes: { type: String, required: false },
  amount: { type: Number, required: true },
  subscriptionTypeId: { type: String, required: true },
  subscriptionType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "SubscriptionType",
  },
  notes: { type: String, required: false },
  paymentDate: { type: Date, required: true },
  renewalDate: { type: Date, required: true, index: true },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  approvedOrRejectedBy: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  status: {
    type: String,
    required: true,
    index: true,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
  paymentReference: { type: String, required: false },
};

export const { Model: PaymentModel, Mapper: PaymentModelMapper } =
  createModel<IPayment>("Payment", paymentSchema, "PYC", "paymentCode");
