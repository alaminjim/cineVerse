import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { watchlistController } from "./watchList.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/:movieId",
  authMiddleware(UserRole.USER),
  watchlistController.addToWatchlist,
);

router.delete(
  "/:movieId",
  authMiddleware(UserRole.USER),
  watchlistController.removeFromWatchlist,
);

router.get("/", authMiddleware(), watchlistController.getWatchlist);

router.get(
  "/check/:movieId",
  authMiddleware(UserRole.USER),
  watchlistController.isInWatchlist,
);

export const watchListRoute = router;
