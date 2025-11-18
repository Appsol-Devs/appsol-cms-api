import mongoose, { Schema, Document, type SchemaDefinition } from "mongoose";
import type { ILead } from "../../../entities/Lead.js";
import { createModel } from "../utils/modelFactory.js";
import type { ICustomer } from "../../../entities/Customer.js";
import type { ICustomerComplaint } from "../../../entities/CustomerComplaint.js";

const customerComplaintSchema: SchemaDefinition = {
  complaintCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  complaintTypeId: { type: String, required: true },
  complaintType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ComplaintType",
  },
  categoryId: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ComplaintCategory",
  },
  description: { type: String, required: true },
  relatedSoftwareId: { type: String, required: true },
  relatedSoftware: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Software",
  },
  status: {
    type: String,
    required: true,
    enum: ["open", "in-progress", "resolved", "closed", "rescheduled"],
    default: "open",
  },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  resolvedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
};

export const {
  Model: CustomerComplaintModel,
  Mapper: CustomerComplaintModelMapper,
} = createModel<ICustomerComplaint>(
  "CustomerComplaint",
  customerComplaintSchema,
  "CCC",
  "complaintCode"
);
