import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { watchlistService } from "./watchList.service";

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
  const result = await watchlistService.isInWatchList(
    movieId as string,
    req.user.userId,
  );
  res.json(result);
});

export const watchlistController = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  isInWatchlist,
};
