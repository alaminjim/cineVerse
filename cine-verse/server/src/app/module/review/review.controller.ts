import { Request, Response } from "express";
import { reviewService } from "./review.service";
import catchFunction from "../../shared/catchFunction";

const createReview = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await reviewService.createReview(req.body, user);
  res.status(201).json({
    success: true,
    message: "Review created (pending approval)",
    data: result,
  });
});

const getMovieReviews = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.getMovieReviews(id as string);
  res.json(result);
});

const getAllReviews = catchFunction(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReviews();
  res.json(result);
});

const updateReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.updateReview(
    id as string,
    req.body,
    req.user.userId,
  );
  res.json({
    success: true,
    message: "Review updated",
    data: result,
  });
});

const deleteReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  await reviewService.deleteReview(id as string, req.user.userId);
  res.json({
    success: true,
    message: "Review deleted",
  });
});

const getPendingReviews = catchFunction(async (req: Request, res: Response) => {
  const result = await reviewService.getPendingReviews();
  res.json(result);
});

const approveReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.approveReview(id as string);
  res.json({
    success: true,
    message: "Review approved",
    data: result,
  });
});

const rejectReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  await reviewService.rejectReview(id as string);
  res.json({
    success: true,
    message: "Review rejected",
  });
});

export const reviewController = {
  createReview,
  getMovieReviews,
  updateReview,
  deleteReview,
  getPendingReviews,
  getAllReviews,
  approveReview,
  rejectReview,
};
