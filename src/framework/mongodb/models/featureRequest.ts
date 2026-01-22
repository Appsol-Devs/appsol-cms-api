import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { IFeatureRequest } from "../../../entities/FeatureRequest.js";

const featureRequestSchema: SchemaDefinition = {
  requestCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  title: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  softwareId: { type: String, required: true },
  software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
  notes: { type: String, required: false },
  requestedDate: { type: Date, required: true },
  description: { type: String, required: true },
  assignedTo: [{ type: Schema.Types.ObjectId, required: false, ref: "User" }],
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  status: {
    type: String,
    required: true,
    default: "new",
    enum: ["new", "under-review", "planned", "complete", "rejected"],
  },
  priority: {
    type: String,
    required: true,
    default: "low",
    enum: ["low", "medium", "high", "critical"],
  },
};

export const { Model: FeatureRequestModel, Mapper: FeatureRequestModelMapper } =
  createModel<IFeatureRequest>(
    "FeatureRequest",
    featureRequestSchema,
    "FRC",
    "requestCode",
  );
