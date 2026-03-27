import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";
import { title } from "node:process";

export const rescheduleSchema = baseQuerySchema.extend({
  customerId: z.string().optional(),
  title: z.string().optional(),
  targetEntityType: z.enum([
    "CustomerOutreach",
    "CustomerComplaint",
    "SubscriptionReminder",
    "Ticket",
    "CustomerSetup",
    "Generic",
  ]),
  targetEntityId: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  originalDateTime: z.string(),
  newDateTime: z.string(),
  from: z.string(),
  to: z.string(),
  colorCode: z.string().optional(),
  reason: z.string(),
});
