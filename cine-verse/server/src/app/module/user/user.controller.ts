import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchFunction from "../../shared/catchFunction.js";
import { userService } from "./user.service.js";

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

const getAllUsers = catchFunction(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers(req.query);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Users retrieved successfully",
    ...result,
  });
});

export const userController = {
  getUserDashboard,
  getUserStats,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
