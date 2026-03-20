import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { analyticsService } from "./analytics.service";
import catchFunction from "../../../shared/catchFunction";

const getAnalyticsStats = catchFunction(async (req: Request, res: Response) => {
  const result = await analyticsService.getAnalyticsStats();
  res.status(StatusCodes.OK).json(result);
});

const getActivityLogs = catchFunction(async (req: Request, res: Response) => {
  const result = await analyticsService.getActivityLogs(req.query);
  res.status(StatusCodes.OK).json(result);
});

const getPendingReviews = catchFunction(async (req: Request, res: Response) => {
  const result = await analyticsService.getPendingReviews(req.query);
  res.status(StatusCodes.OK).json(result);
});

const approveReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await analyticsService.approveReview(id as string);
  res.status(StatusCodes.OK).json(result);
});

const rejectReview = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const result = await analyticsService.rejectReview(id as string, reason);
  res.status(StatusCodes.OK).json(result);
});

export const analyticsController = {
  getAnalyticsStats,
  getActivityLogs,
  getPendingReviews,
  approveReview,
  rejectReview,
};
