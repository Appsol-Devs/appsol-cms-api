import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const subscriptionSchema = baseQuerySchema.extend({
  customerId: z.string(),
  softwareId: z.string(),
  subscriptionTypeId: z.string(),
  status: z.enum(["active", "inactive"]),
  autoRenew: z.boolean(),
  startDate: z.string(),
  nextBillingDate: z.string(),
  notes: z.string().optional(),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  amount: z.number(),
});
