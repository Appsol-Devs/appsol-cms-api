import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const customerComplaintSchema = baseQuerySchema.extend({
  customerId: z.string(),
  complaintTypeId: z.string(),
  complaintCategoryId: z.string(),
  description: z.string(),
  relatedSoftwareId: z.string(),
  status: z
    .enum(["open", "in-progress", "resolved", "closed", "rescheduled"])
    .optional(),
});
