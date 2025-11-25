import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

/**
 * const customerSetupSchema: SchemaDefinition = {
   requestCode: { type: String, unique: true },
   customerId: { type: String, required: true },
   title: { type: String, required: true },
   customer: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
   softwareId: { type: String, required: true },
   software: { type: Schema.Types.ObjectId, required: true, ref: "Software" },
   setupStatusId: { type: String, required: true },
   setupStatus: {
     type: Schema.Types.ObjectId,
     required: true,
     ref: "SetupStatus",
   },
   scheduledStart: { type: Date, required: true },
   scheduledEnd: { type: Date, required: true },
   actualCompletionDate: { type: Date, required: false },
   notes: { type: String, required: false },
   description: { type: String, required: true },
   assignedTo: [{ type: Schema.Types.ObjectId, required: false, ref: "User" }],
   loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
   status: {
     type: String,
     required: true,
     default: "scheduled",
     enum: ["scheduled", "inProgress", "completed", "cancelled"],
   },
   priority: {
     type: String,
     required: true,
     default: "P4",
     enum: ["P1", "P2", "P3", "P4"],
   },
 };
 */

export const customerSetupSchema = baseQuerySchema.extend({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
  softwareId: z.string(),
  customerId: z.string(),
  setupStatusId: z.string(),
  assignedTo: z.array(z.string()).optional(),
  notes: z.string().optional(),
  scheduledStart: z.string(),
  scheduledEnd: z.string(),
  status: z.enum(["scheduled", "inProgress", "completed", "cancelled"]),
});
