import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";
import type { IStore } from "../../../entities/Store.js";

const storeSchema: SchemaDefinition = {
  storeCode: { type: String, unique: true },
  customerId: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
  name: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String, required: false },
  status: {
    type: String,
    required: true,
    default: "active",
    enum: ["active", "inactive"],
  },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
};

export const { Model: StoreModel, Mapper: StoreModelMapper } =
  createModel<IStore>("Store", storeSchema, "STO", "storeCode");
