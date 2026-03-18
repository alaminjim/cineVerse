import { z } from "zod";

export const authRegisterValidationSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z.string("Email is required").email("Invalid email address"),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number"),
});

export const authLoginValidationSchema = z.object({
  email: z.string("Email is required").email("Invalid email address"),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const IAuthRegisterValidation = {
  authRegisterValidationSchema,
};
export const IAuthLoginValidation = { authLoginValidationSchema };
