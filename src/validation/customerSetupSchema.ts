import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const customerSetupSchema = baseQuerySchema.extend({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  softwareId: z.string(),
  customerId: z.string(),
  setupStatusId: z.string(),
  assignedTo: z.array(z.string()).optional(),
  notes: z.string().optional(),
  scheduledStart: z.string(),
  scheduledEnd: z.string(),
  status: z.enum(["scheduled", "inProgress", "completed", "cancelled"]),
});
