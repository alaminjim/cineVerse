/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { reviewService } from "./review.service.js";
import catchFunction from "../../shared/catchFunction.js";

const createReview = catchFunction(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { movieId, title, rating, content, hasSpoiler, tags } = req.body;

  if (!movieId || !title || !rating || !content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "All fields are required",
    });
  }

  const result = await reviewService.createReview(user.userId, {
    movieId,
    title,
    rating,
    content,
    hasSpoiler,
    tags,
  });

  res.status(StatusCodes.CREATED).json(result);
});

const getReviewsByMovieId = catchFunction(
  async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const result = await reviewService.getReviewsByMovieId(
      movieId as string,
      req.query,
    );

    res.status(StatusCodes.OK).json(result);
  },
);

const getReviewById = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.getReviewById(id as string);

  res.status(StatusCodes.OK).json(result);
});

const updateReview = catchFunction(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await reviewService.updateReview(
    id as string,
    user.userId,
    req.body,
  );

  res.status(StatusCodes.OK).json(result);
});

const deleteReview = catchFunction(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await reviewService.deleteReview(id as string, user.userId);

  res.status(StatusCodes.OK).json(result);
});

const getPendingReviews = catchFunction(async (req: Request, res: Response) => {
  const result = await reviewService.getPendingReviews(req.query);
  res.status(StatusCodes.OK).json(result);
});

const getAllReviews = catchFunction(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReviews();
  res.status(StatusCodes.OK).json(result);
});

const approveReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Review ID is required",
    });
  }

  const result = await reviewService.approveReview(id as string);
  res.status(StatusCodes.OK).json(result);
});

const rejectReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Review ID is required",
    });
  }

  const result = await reviewService.rejectReview(id as string, reason);
  res.status(StatusCodes.OK).json(result);
});

const getRecentApprovedReviews = catchFunction(async (req: Request, res: Response) => {
  const result = await reviewService.getRecentApprovedReviews(10);
  res.status(StatusCodes.OK).json(result);
});

const syncRatings = catchFunction(async (req: Request, res: Response) => {

  const result = await reviewService.syncRatings();
  res.status(StatusCodes.OK).json(result);
});

export const reviewController = {
  createReview,
  getReviewsByMovieId,
  getReviewById,
  updateReview,
  deleteReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  getAllReviews,
  getRecentApprovedReviews,
  syncRatings,
};
