import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { likeController } from "./likes.controller.js";
import { UserRole } from "@prisma/client";




const router = Router();

router.post(
  "/:reviewId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  likeController.likeReview,
);

router.delete(
  "/:reviewId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  likeController.unlikeReview,
);

router.get(
  "/check/:reviewId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  likeController.isLiked,
);

export const likeRoute = router;
