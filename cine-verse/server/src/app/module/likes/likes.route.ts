import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { likeController } from "./likes.controller";
import { UserRole } from "../../../generated/prisma/enums";

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
