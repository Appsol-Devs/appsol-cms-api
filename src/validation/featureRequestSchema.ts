import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const featureRequestSchema = baseQuerySchema.extend({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
  softwareId: z.string(),
  customerId: z.string(),
  assignedTo: z.array(z.string()).optional(),
  notes: z.string().optional(),
  requestedDate: z.string(),
  status: z.enum(["new", "under-review", "planned", "complete", "rejected"]),
});
