import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";
import { adminMovieController } from "./movies.controller";
import { upload } from "../../config/multer";
import { zodValidation } from "../../middleware/zod.validation";
import {
  createMovieValidationSchema,
  updateMovieValidationSchema,
} from "./movies.validation";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  upload.single("file"),
  zodValidation(createMovieValidationSchema),
  adminMovieController.createMovie,
);

router.put(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  upload.single("file"),
  zodValidation(updateMovieValidationSchema),
  adminMovieController.updateMovie,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  adminMovieController.deleteMovie,
);

export const movieRouter = router;
