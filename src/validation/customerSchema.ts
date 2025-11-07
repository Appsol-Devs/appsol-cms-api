import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const customerQuerySchema = baseQuerySchema.extend({
  name: z.string(),
  phone: z.string().max(13).min(10),
  email: z.email(),
  companyName: z.string(),
  dateConverted: z.string(),
  location: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  geolocation: z
    .object({
      address: z.string().optional(),
      long: z.number().optional(),
      lat: z.number().optional(),
    })
    .optional(),
  notes: z.string().optional(),
});
