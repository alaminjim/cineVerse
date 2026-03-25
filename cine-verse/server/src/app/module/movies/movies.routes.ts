import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRole } from "@prisma/client";
import { movieController } from "./movies.controller.js";
import { upload } from "../../config/multer.js";
import { zodValidation } from "../../middleware/zod.validation.js";
import {
  createMovieValidationSchema,
  updateMovieValidationSchema,
} from "./movies.validation.js";

const router = Router();

router.get("/new-releases", movieController.getNewReleases);
router.get("/coming-soon", movieController.getComingSoon);
router.get("/editors-picks", movieController.getEditorsPicks);
router.get("/featured", movieController.getFeaturedMovies);
router.get("/", movieController.getAllMovies);

router.get("/:id", movieController.getMovieById);

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  upload.single("file"),
  zodValidation(createMovieValidationSchema),
  movieController.createMovie,
);

router.patch(
  "/:id/buy-price",
  authMiddleware(UserRole.ADMIN),
  movieController.updateMovie,
);

router.put(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  upload.single("file"),
  zodValidation(updateMovieValidationSchema),
  movieController.updateMovie,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  movieController.deleteMovie,
);

export const movieRouter = router;
