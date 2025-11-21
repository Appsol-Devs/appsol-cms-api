import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const paymentSchema = baseQuerySchema.extend({
  customerId: z.string().optional(),
  subscriptionTypeId: z.string(),
  paymentDate: z.string(),
  renewalDate: z.string(),
  notes: z.string().optional(),
  amount: z.number().min(0),
  paymentReference: z.string().optional(),
});
