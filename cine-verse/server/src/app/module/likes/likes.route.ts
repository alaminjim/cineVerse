import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { likeController } from "./likes.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/:reviewId",
  authMiddleware(UserRole.USER),
  likeController.likeReview,
);

router.delete(
  "/:reviewId",
  authMiddleware(UserRole.USER),
  likeController.unlikeReview,
);

router.get(
  "/check/:reviewId",
  authMiddleware(UserRole.USER),
  likeController.isLiked,
);

export const likeRoute = router;
