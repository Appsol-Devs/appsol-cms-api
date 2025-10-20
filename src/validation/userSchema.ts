import { z } from "zod";

/**
 * firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    imageUrl: String,
 */
export const registerUserSchema = z
  .object({
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(30),
    email: z.email(),
    phone: z.string().min(10),
    imageUrl: z.string().optional(),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Set the path of the error to 'confirmPassword'
  });

export type RegisterUserPayload = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

export const verifySignupOtpSchema = z.object({
  otp: z.string().max(6).min(6),
  userId: z.string(),
});
