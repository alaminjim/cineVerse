import { z } from "zod";

export const createMovieValidationSchema = z.object({
  title: z
    .string("Title must be a string")
    .min(1, "Title is required")
    .max(100, "Title max 100 characters"),

  synopsis: z
    .string("Synopsis must be a string")
    .min(10, "Synopsis min 10 characters"),

  genre: z.array(z.string()).min(1, "At least one genre required"),

  releaseYear: z.coerce
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 5, "Invalid year"),

  director: z.string().min(2, "Director min 2 characters"),

  cast: z.array(z.string()).min(1, "At least one actor required"),

  streamingPlatform: z
    .array(z.string())
    .min(1, "At least one platform required"),

  type: z.enum(["MOVIE", "SERIES"]),

  seasons: z.coerce.number().optional(),
  episodes: z.coerce.number().optional(),
  runtime: z.coerce.number().optional(),
  streamingLink: z.string().url().optional().or(z.literal("")),

  pricing: z.enum(["FREE", "PREMIUM"]),

  buyPrice: z.coerce.number().optional(),
  rentPrice: z.coerce.number().optional(),
});

export const updateMovieValidationSchema =
  createMovieValidationSchema.partial();
