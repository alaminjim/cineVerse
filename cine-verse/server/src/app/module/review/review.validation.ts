import { z } from "zod";

export const createReviewValidationSchema = z.object({
  movieId: z.string("Movie ID is required"),

  rating: z
    .number("Rating is required")
    .min(1, "Rating min 1")
    .max(10, "Rating max 10"),

  title: z
    .string("Title is required")
    .min(5, "Title min 5 characters")
    .max(100, "Title max 100 characters"),

  content: z.string("Content is required").min(20, "Content min 20 characters"),

  tags: z.array(z.string()).optional(),

  hasSpoiler: z.boolean().optional().default(false),
});

export const updateReviewValidationSchema = z.object({
  movieId: z.string("Movie ID is required"),

  rating: z
    .number("Rating is required")
    .min(1, "Rating min 1")
    .max(10, "Rating max 10")
    .optional(),

  title: z
    .string("Title is required")
    .min(5, "Title min 5 characters")
    .max(100, "Title max 100 characters")
    .optional(),

  content: z
    .string("Content is required")
    .min(20, "Content min 20 characters")
    .optional(),

  tags: z.array(z.string()).optional(),

  hasSpoiler: z.boolean().optional().default(false).optional(),
});
