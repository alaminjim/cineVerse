import { Router } from "express";
import { commentController } from "./comment.controller";
import {
  createCommentValidationSchema,
  updateCommentValidationSchema,
} from "./comment.validation";
import { authMiddleware } from "../../middleware/authMiddleware";
import { zodValidation } from "../../middleware/zod.validation";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  zodValidation(createCommentValidationSchema),
  commentController.createComment,
);

router.get("/review/:reviewId", commentController.getCommentsByReview);

router.get("/:id", commentController.getCommentById);

router.get("/", commentController.getAllComments);

router.put(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  zodValidation(updateCommentValidationSchema),
  commentController.updateComment,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  commentController.deleteComment,
);

export const commentRoute = router;
