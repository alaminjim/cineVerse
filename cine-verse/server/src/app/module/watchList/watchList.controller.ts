import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction.js";
import { watchlistService } from "./watchList.service.js";

const addToWatchlist = catchFunction(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await watchlistService.addToWatchList(
    movieId as string,
    req.user.userId,
  );
  res.status(201).json(result);
});

const removeFromWatchlist = catchFunction(
  async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const result = await watchlistService.removeFromWatchList(
      movieId as string,
      req.user.userId,
    );
    res.json(result);
  },
);

const getWatchlist = catchFunction(async (req: Request, res: Response) => {
  const result = await watchlistService.getWatchList(req.user.userId);
  res.json(result);
});

const isInWatchlist = catchFunction(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.json({ success: true, data: false });
  }

  const result = await watchlistService.isInWatchList(
    movieId as string,
    userId,
  );
  res.json(result);
});

export const watchlistController = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  isInWatchlist,
};
