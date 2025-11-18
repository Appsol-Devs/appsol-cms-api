import mongoose, { Schema, Document, type SchemaDefinition } from "mongoose";
import type { ILead } from "../../../entities/Lead.js";
import { createModel } from "../utils/modelFactory.js";
import type { ICustomer } from "../../../entities/Customer.js";

const customerSchema: SchemaDefinition = {
  customerCode: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  dateConverted: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  location: { type: String, required: false },
  notes: { type: String, required: false },
  geolocation: {
    address: { type: String, required: false },
    long: Number,
    lat: Number,
  },
  image: { type: String, required: false },
};

export const { Model: CustomerModel, Mapper: CustomerModelMapper } =
  createModel<ICustomer>("Customer", customerSchema, "CUS", "customerCode");
