import z from "zod";
import { baseQuerySchema } from "./baseSchema.js";

export const leadQuerySchema = baseQuerySchema.extend({
  name: z.string(),
  phone: z.string().max(13).min(10),
  email: z.email(),
  companyName: z.string(),
  leadSource: z.string(),
  softwareId: z.string(),
  initialEnquiryDate: z.string(),
  location: z.string().optional(),
  leadStatus: z.enum([
    "evaluating",
    "buildingProposal",
    "qualified",
    "negotiation",
    "new",
  ]),
  priority: z.enum(["low", "medium", "high"]),
  leadStage: z.string().optional(),
  nextStep: z.string().optional(),
  loggedBy: z.string().optional(),
  geolocation: z
    .object({
      address: z.string().optional(),
      long: z.number().optional(),
      lat: z.number().optional(),
    })
    .optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = leadQuerySchema.partial();
