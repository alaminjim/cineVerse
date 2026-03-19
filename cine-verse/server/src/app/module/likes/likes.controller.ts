import { Request, Response } from "express";
import { likeService } from "./likes.service";
import catchFunction from "../../shared/catchFunction";

const likeReview = catchFunction(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const result = await likeService.likeReview(
    reviewId as string,
    req.user.userId,
  );
  res.status(201).json(result);
});

const unlikeReview = catchFunction(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const result = await likeService.unlikeReview(
    reviewId as string,
    req.user.userId,
  );
  res.json(result);
});

const isLiked = catchFunction(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const result = await likeService.isLiked(reviewId as string, req.user.userId);
  res.json(result);
});

export const likeController = {
  likeReview,
  unlikeReview,
  isLiked,
};
