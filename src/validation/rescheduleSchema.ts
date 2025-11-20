import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const rescheduleSchema = baseQuerySchema.extend({
  customerId: z.string().optional(),
  targetEntityType: z.enum(["CustomerOutreach", "CustomerComplaint"]),
  targetEntityId: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  originalDateTime: z.string(),
  newDateTime: z.string(),
  colorCode: z.string().optional(),
  reason: z.string(),
});
