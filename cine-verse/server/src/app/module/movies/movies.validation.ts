import { z } from "zod";

export const createMovieValidationSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(100, "Title max 100 characters"),

  synopsis: z
    .string("Synopsis is required")
    .min(10, "Synopsis min 10 characters"),

  genre: z.array(z.string()).min(1, "At least one genre required"),

  releaseYear: z
    .number("Release year is required")
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 5, "Invalid year"),

  director: z
    .string("Director is required")
    .min(2, "Director min 2 characters"),

  cast: z.array(z.string()).min(1, "At least one actor required"),

  streamingPlatform: z
    .array(z.string())
    .min(1, "At least one platform required"),

  pricing: z.enum(["FREE", "PREMIUM"], {
    message: "Pricing must be FREE or PREMIUM",
  }),
});

export const updateMovieValidationSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(100, "Title max 100 characters")
    .optional(),

  synopsis: z
    .string("Synopsis is required")
    .min(10, "Synopsis min 10 characters")
    .optional(),

  genre: z.array(z.string()).min(1, "At least one genre required").optional(),

  releaseYear: z
    .number("Release year is required")
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 5, "Invalid year")
    .optional(),

  director: z
    .string("Director is required")
    .min(2, "Director min 2 characters")
    .optional(),

  cast: z.array(z.string()).min(1, "At least one actor required").optional(),

  streamingPlatform: z
    .array(z.string())
    .min(1, "At least one platform required")
    .optional(),

  pricing: z
    .enum(["FREE", "PREMIUM"], {
      message: "Pricing must be FREE or PREMIUM",
    })
    .optional(),
});
