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
  checkInTime: z.coerce.date().default(() => new Date()),
  checkOutTime: z.coerce.date().optional(),
  passNumber: z.string().optional(),
  itemsCarriedIn: z.string().optional(),
  itemsCarriedOut: z.string().optional(),
  status: z.enum(["checked_in", "checked_out"]).optional(),
  loggedBy: z.string().min(1, "LoggedBy user ID is required"),
  photoUrl: z.string().optional(),
});
