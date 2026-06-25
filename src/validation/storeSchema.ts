import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const storeSchema = baseQuerySchema.extend({
  customerId: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
