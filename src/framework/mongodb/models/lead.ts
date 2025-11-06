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
  leadStatus: {
    type: String,
    required: true,
    enum: ["evaluating", "buildingProposal", "qualified", "won", "negotiation"],
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
  location: { type: String, required: true },
  notes: { type: String, required: true },
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
  "leadCode"
);
