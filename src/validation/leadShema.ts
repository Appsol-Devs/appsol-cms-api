import z, { email } from "zod";
import { baseQuerySchema } from "./baseSchema.js";

/**
 * {
  leadCode: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  leadSource: { type: String, required: true },
  initialEnquiryDate: { type: String, required: true },
  leadStatus: {
    type: String,
    required: true,
    enum: ["evaluating", "buildingProposal", "qualified", "won", "negotiation"],
  },
  loggedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  leadStage: { type: Schema.Types.ObjectId, required: true, ref: "LeadStage" },
  priority: { type: String, required: true, enum: ["low", "medium", "high"] },
  nextStep: { type: Schema.Types.ObjectId, required: true, ref: "NextStep" },
  location: { type: String, required: true },
  notes: { type: String, required: true },
};

 */

export const leadQuerySchema = baseQuerySchema.extend({
  name: z.string(),
  phone: z.string().max(13).min(10),
  email: z.email(),
  companyName: z.string(),
  leadSource: z.string(),
  initialEnquiryDate: z.string(),
  location: z.string().optional(),
  leadStatus: z.enum([
    "evaluating",
    "buildingProposal",
    "qualified",
    "won",
    "negotiation",
  ]),
  priority: z.enum(["low", "medium", "high"]),
  leadStage: z.string().optional(),
  nextStep: z.string().optional(),
  loggedBy: z.string().optional(),
  geolocation: z.object({
    address: z.string().optional(),
    long: z.number().optional(),
    lat: z.number().optional(),
  }),
});
