import mongoose, { Schema, Document, type SchemaDefinition } from "mongoose";
import type { ILead } from "../../../entities/Lead.js";
import { createModel } from "../utils/modelFactory.js";

const leadSchema: SchemaDefinition = {
  leadCode: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  leadSource: { type: String, required: true },
  initialEnquiryDate: { type: String, required: true },
  softwareId: { type: String, required: true },
  software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
  leadStatus: {
    type: String,
    required: true,
    enum: [
      "new",
      "evaluating",
      "buildingProposal",
      "qualified",
      "won",
      "negotiation",
      "closed",
      "rejected",
    ],
    default: "new",
  },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  leadStage: { type: Schema.Types.ObjectId, required: false, ref: "LeadStage" },
  priority: { type: String, required: true, enum: ["low", "medium", "high"] },
  nextStep: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "LeadNextStep",
  },
  isConverted: { type: Boolean, required: true, default: false },
  location: { type: String, required: false },
  notes: { type: String, required: false },
  geolocation: {
    address: { type: String, required: false },
    long: Number,
    lat: Number,
  },
};

export const { Model: LeadModel, Mapper: LeadModelMapper } = createModel<ILead>(
  "Lead",
  leadSchema,
  "LDC",
  "leadCode",
);
