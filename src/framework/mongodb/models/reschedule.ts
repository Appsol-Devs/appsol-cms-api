import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { IReschedule } from "../../../entities/Reschedule.js";

const rescheduleSchema: SchemaDefinition = {
  rescheduleCode: { type: String, unique: true },
  customerId: { type: String, required: false },
  customer: { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  reason: { type: String, required: true },
  title: { type: String, required: false },
  colorCode: { type: String, required: false },
  targetEntityType: {
    type: String,
    required: true,
    enum: [
      "CustomerOutreach",
      "CustomerComplaint",
      "SubscriptionReminder",
      "Ticket",
      "CustomerSetup",
      "Generic",
    ],
  },
  targetEntityId: { type: String, required: false },
  // targetEntity: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   refPath: "targetEntityType",
  // },
  originalDateTime: { type: Date, required: true, unique: true },
  newDateTime: { type: Date, required: true, unique: true },
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
    "rescheduleCode",
  );
