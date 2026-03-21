import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";
import { zodValidation } from "../../middleware/zod.validation";
import {
  createReviewValidationSchema,
  updateReviewValidationSchema,
} from "./review.validation";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER),
  zodValidation(createReviewValidationSchema),
  reviewController.createReview,
);

router.get("/movie/:id", reviewController.getMovieReviews);

router.get("/", reviewController.getAllReviews);

router.put(
  "/:id",
  authMiddleware(UserRole.USER),
  zodValidation(updateReviewValidationSchema),
  reviewController.updateReview,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  reviewController.deleteReview,
);

router.get(
  "/pending",
  authMiddleware(UserRole.ADMIN),
  reviewController.getPendingReviews,
);

router.put(
  "/approved/:id",
  authMiddleware(UserRole.ADMIN),
  reviewController.approveReview,
);

router.put(
  "/rejected/:id",
  authMiddleware(UserRole.ADMIN),
  reviewController.rejectReview,
);

export const reviewRoute = router;
