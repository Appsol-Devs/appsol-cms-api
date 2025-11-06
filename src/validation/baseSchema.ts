import z from "zod";

export const baseQuerySchema = z.object({
  notes: z.string().optional(),
});

export type TBaseQuerySchema = z.infer<typeof baseQuerySchema>;
