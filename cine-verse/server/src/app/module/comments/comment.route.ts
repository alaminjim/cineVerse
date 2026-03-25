import { Router } from "express";
import { commentController } from "./comment.controller.js";
import {
  createCommentValidationSchema,
  updateCommentValidationSchema,
} from "./comment.validation.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { zodValidation } from "../../middleware/zod.validation.js";
import { UserRole } from "../../../generated/prisma/enums.js";



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
