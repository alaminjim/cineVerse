import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { watchlistController } from "./watchList.controller.js";
import { UserRole } from "@prisma/client";


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
  (req, res, next) => { (req as any).isOptional = true; next(); },
  authMiddleware(),
  watchlistController.isInWatchlist,
);

export const watchListRoute = router;
