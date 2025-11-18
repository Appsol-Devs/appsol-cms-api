import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const customerOutreachSchema = baseQuerySchema.extend({
  customerId: z.string(),
  callStatusId: z.string(),
  purpose: z.string(),
  notes: z.string().optional(),
  isRoutineCall: z.boolean().optional(),
  status: z.enum([
    "pending",
    "completed",
    "failed",
    "rescheduled",
    "cancelled",
  ]),
  outreachTypeId: z.string(),
});
