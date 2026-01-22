import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";
import type { ITicket } from "../../../entities/Ticket.js";

const ticketSchema: SchemaDefinition = {
  ticketCode: { type: String, unique: true },
  title: { type: String, required: false },
  complaintId: { type: String, required: true },

  complaint: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CustomerComplaint",
  },
  assignedEngineerId: { type: String, required: false },
  assignedEngineer: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  requestedDate: { type: Date, required: true },
  notes: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ["open", "assigned", "fixed", "closed", "rejected"],
    default: "open",
  },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
  rejectionReason: { type: String, required: false },
  history: [
    {
      from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      to: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      date: { type: Date, required: true },
      reason: { type: String, required: false },
    },
  ],
};

export const { Model: TicketModel, Mapper: TicketModelMapper } =
  createModel<ITicket>("Ticket", ticketSchema, "TKT", "ticketCode");
