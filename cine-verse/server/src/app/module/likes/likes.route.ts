import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { likeController } from "./likes.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { zodValidation } from "../../middleware/zod.validation";
import { likeValidationSchema } from "./likes.validation";

const router = Router();

router.post(
  "/:reviewId",
  authMiddleware(UserRole.USER),
  zodValidation(likeValidationSchema),
  likeController.likeReview,
);

router.delete(
  "/:reviewId",
  authMiddleware(UserRole.USER),
  zodValidation(likeValidationSchema),
  likeController.unlikeReview,
);

router.get(
  "/check/:reviewId",
  authMiddleware(UserRole.USER),
  zodValidation(likeValidationSchema),
  likeController.isLiked,
);

export const likeRoute = router;
