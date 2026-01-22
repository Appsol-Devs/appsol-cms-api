import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const ticketsSchema = baseQuerySchema.extend({
  title: z.string(),
  requestedDate: z.string(),
  notes: z.string().optional(),
  rejectionReason: z.string().optional(),
  complaintId: z.string(),
  assignedEngineerId: z.string().optional(),
  priority: z.enum(["low", "medium", "hight", "urgent"]).optional(),

});
