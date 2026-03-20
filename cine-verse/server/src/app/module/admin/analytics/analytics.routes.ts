import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { analyticsController } from "./analytics.controller";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.get(
  "/stats",
  authMiddleware(UserRole.ADMIN),
  analyticsController.getAnalyticsStats,
);

router.get(
  "/activity-logs",
  authMiddleware(UserRole.ADMIN),
  analyticsController.getActivityLogs,
);

router.get(
  "/pending-reviews",
  authMiddleware(UserRole.ADMIN),
  analyticsController.getPendingReviews,
);

router.patch(
  "/pending-reviews/approve/:id",
  authMiddleware(UserRole.ADMIN),
  analyticsController.approveReview,
);

router.patch(
  "/pending-reviews/:id/reject",
  authMiddleware(UserRole.ADMIN),
  analyticsController.rejectReview,
);

export const adminAnalytics = router;
