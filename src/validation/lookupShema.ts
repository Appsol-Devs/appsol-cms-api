import z from "zod";

export const lookupSchema = z.object({
  name: z.string(),
  colorCode: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const subscriptionTypeSchema = lookupSchema.extend({
  durationInMonths: z.number().min(1),
});
