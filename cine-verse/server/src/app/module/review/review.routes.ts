import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRole } from "@prisma/client";
import { zodValidation } from "../../middleware/zod.validation.js";
import {
  createReviewValidationSchema,
  updateReviewValidationSchema,
} from "./review.validation.js";
import { reviewController } from "./review.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  zodValidation(createReviewValidationSchema),
  reviewController.createReview,
);

router.get("/", reviewController.getAllReviews);
router.get("/recent-approved", reviewController.getRecentApprovedReviews);
router.get("/sync-ratings", reviewController.syncRatings);


router.get("/movie/:movieId", reviewController.getReviewsByMovieId);

router.put(
  "/:id",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
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
