import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { ICustomerSetup } from "../../../entities/CustomerSetup.js";

const customerSetupSchema: SchemaDefinition = {
  requestCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  title: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  softwareId: { type: String, required: true },
  software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
  setupStatusId: { type: String, required: true },
  setupStatus: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "SetupStatus",
  },
  scheduledStart: { type: Date, required: true },
  scheduledEnd: { type: Date, required: true },
  actualCompletionDate: { type: Date, required: false },
  notes: { type: String, required: false },
  description: { type: String, required: true },
  assignedTo: [{ type: Schema.Types.ObjectId, required: false, ref: "User" }],
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  status: {
    type: String,
    required: true,
    default: "scheduled",
    enum: ["scheduled", "inProgress", "completed", "cancelled"],
  },
  priority: {
    type: String,
    required: true,
    default: "low",
    enum: ["low", "medium", "high", "critical"],
  },
};

export const { Model: CustomerSetupModel, Mapper: CustomerSetupModelMapper } =
  createModel<ICustomerSetup>(
    "CustomerSetup",
    customerSetupSchema,
    "CSC",
    "setupCode",
  );
