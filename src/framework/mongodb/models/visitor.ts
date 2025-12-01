import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";
import type { IVisitor } from "../../../entities/Vistor.js";

const visitorSchema: SchemaDefinition = {
  visitorCode: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: false },
  idType: { type: String, required: false },
  idNumber: { type: String, required: false },

  visitingWhom: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  purpose: { type: String, required: true },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
    required: false,
  },

  passNumber: { type: String, required: false },
  itemsCarriedIn: { type: String, required: false },
  itemsCarriedOut: { type: String, required: false },

  status: {
    type: String,
    enum: ["checked_in", "checked_out"],
    default: "checked_in",
  },

  loggedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  photoUrl: { type: String, required: false },
  notes: { type: String, required: false },
};

export const { Model: VisitorModel, Mapper: VisitorModelMapper } =
  createModel<IVisitor>("Visitor", visitorSchema, "VISC", "visitorCode");
