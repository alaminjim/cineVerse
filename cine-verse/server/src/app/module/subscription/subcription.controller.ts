import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchFunction from "../../shared/catchFunction";
import { subscriptionService } from "./subcription.service";

const createSubscription = catchFunction(
  async (req: Request, res: Response) => {
    const { planType } = req.body;

    if (!planType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "planType is required",
      });
    }

    if (!["MONTHLY", "YEARLY"].includes(planType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "planType must be MONTHLY or YEARLY",
      });
    }

    const result = await subscriptionService.createSubscription(
      { planType },
      req.user.userId,
      req.user.email || "",
    );

    res.status(StatusCodes.CREATED).json(result);
  },
);

const confirmSubscription = catchFunction(
  async (req: Request, res: Response) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const result = await subscriptionService.confirmSubscription(
      sessionId as string,
    );

    res.status(StatusCodes.OK).json(result);
  },
);

const getActiveSubscription = catchFunction(
  async (req: Request, res: Response) => {
    const result = await subscriptionService.getActiveSubscription(
      req.user.userId,
    );

    res.status(StatusCodes.OK).json(result);
  },
);

const cancelSubscription = catchFunction(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const result = await subscriptionService.cancelSubscription(
      id as string,
      req.user.userId,
    );

    res.status(StatusCodes.OK).json(result);
  },
);

const getAllSubscriptions = catchFunction(async (req: Request, res: Response) => {
  const result = await subscriptionService.getAllSubscriptions();
  res.status(StatusCodes.OK).json(result);
});

export const subscriptionController = {
  createSubscription,
  confirmSubscription,
  getActiveSubscription,
  getAllSubscriptions,
  cancelSubscription,
};
