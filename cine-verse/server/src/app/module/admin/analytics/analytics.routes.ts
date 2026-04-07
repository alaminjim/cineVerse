import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware.js";
import { analyticsController } from "./analytics.controller.js";
import { UserRole } from "@prisma/client";


const router = Router();

router.get(
  "/stats",
  authMiddleware(UserRole.ADMIN),
  analyticsController.getAnalyticsStats,
);

router.get(
  "/chart-data",
  authMiddleware(UserRole.ADMIN),
  analyticsController.getChartData,
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
