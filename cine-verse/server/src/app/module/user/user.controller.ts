import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchFunction from "../../shared/catchFunction";
import { userService } from "./user.service";

const getUserDashboard = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userService.getUserDashboard(user.userId);
  res.status(StatusCodes.OK).json(result);
});

const getUserStats = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userService.getUserStats(user.userId);
  res.status(StatusCodes.OK).json(result);
});

const getUserProfile = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userService.getUserProfile(user.userId);
  res.status(StatusCodes.OK).json(result);
});

const updateUserProfile = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;

  if (!req.body.name && !req.body.email && !req.body.image) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "At least one field is required to update",
    });
  }

  const result = await userService.updateUserProfile(user.userId, req.body);
  res.status(StatusCodes.OK).json(result);
});

export const userController = {
  getUserDashboard,
  getUserStats,
  getUserProfile,
  updateUserProfile,
};
