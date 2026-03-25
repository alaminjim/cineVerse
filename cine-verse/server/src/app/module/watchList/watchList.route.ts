import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { watchlistController } from "./watchList.controller.js";
import { UserRole } from "../../../generated/prisma/enums.js";


const router = Router();

router.post(
  "/:movieId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  watchlistController.addToWatchlist,
);

router.delete(
  "/:movieId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  watchlistController.removeFromWatchlist,
);

router.get("/", authMiddleware(), watchlistController.getWatchlist);

router.get(
  "/check/:movieId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  watchlistController.isInWatchlist,
);

export const watchListRoute = router;
