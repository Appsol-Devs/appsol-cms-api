import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const visitorsSchema = baseQuerySchema.extend({
  fullName: z.string(),
  phone: z.string().max(13).min(10),
  email: z.email().optional(),
  purpose: z.string(),
  notes: z.string().optional(),
  company: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  visitingWhom: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  passNumber: z.string().optional(),
  itemsCarriedIn: z.string().optional(),
  itemsCarriedOut: z.string().optional(),
  status: z.enum(["checked_in", "checked_out"]).optional(),
  photoUrl: z.string().optional(),
});
