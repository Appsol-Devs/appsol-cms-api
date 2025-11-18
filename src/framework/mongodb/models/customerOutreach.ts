import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { ICustomerOutreach } from "../../../entities/CustomerOutreach.js";

const customerOutreachSchema: SchemaDefinition = {
  outreachCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  purpose: { type: String, required: true },
  notes: { type: String, required: false },
  callStatus: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CallStatus",
  },
  outreachType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "OutreachType",
  },
  outreachTypeId: { type: String },
  callStatusId: {
    type: String,
  },
  isRoutineCall: { type: Boolean, required: false, default: false },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "completed", "failed", "rescheduled", "cancelled"],
  },
};

export const {
  Model: CustomerOutreachModel,
  Mapper: CustomerOutreachModelMapper,
} = createModel<ICustomerOutreach>(
  "CustomerOutreach",
  customerOutreachSchema,
  "COC",
  "OutreachCode"
);
