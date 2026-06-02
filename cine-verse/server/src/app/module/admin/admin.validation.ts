import { z } from "zod";

export const adminUpdateValidationSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters"),

  profilePhoto: z.string().url("Invalid URL").optional(),

  description: z.string().max(500, "Max 500 characters").optional(),

  contactNumber: z.string().optional(),
});

export const IAdminUpdateValidation = {
  adminUpdateValidationSchema,
};
