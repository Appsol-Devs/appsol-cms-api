import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { IReschedule } from "../../../entities/Reschedule.js";

const rescheduleSchema: SchemaDefinition = {
  rescheduleCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  reason: { type: String, required: true },
  colorCode: { type: String, required: false },
  targetEntityType: {
    type: String,
    required: true,
    enum: ["CustomerOutreach", "CustomerComplaint"],
  },
  targetEntityId: { type: String, required: true },
  targetEntity: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "targetEntityType",
  },
  originalDateTime: { type: Date, required: true },
  newDateTime: { type: Date, required: true },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
};

export const { Model: RescheduleModel, Mapper: RescheduleModelMapper } =
  createModel<IReschedule>(
    "Reschedule",
    rescheduleSchema,
    "RSC",
    "rescheduleCode"
  );
