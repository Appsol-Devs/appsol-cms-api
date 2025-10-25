import z from "zod";

export const lookupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
