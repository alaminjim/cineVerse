import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { purchaseService } from "./purchase.service";
import catchFunction from "../../shared/catchFunction";

const createPurchaseCheckout = catchFunction(
  async (req: Request, res: Response) => {
    const { movieId, purchaseType } = req.body;

    if (!movieId || !purchaseType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "movieId and purchaseType are required",
      });
    }

    if (!["BUY", "RENT"].includes(purchaseType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "purchaseType must be BUY or RENT",
      });
    }

    const result = await purchaseService.createPurchaseCheckout(
      { movieId, purchaseType },
      req.user.userId,
      req.user.email || "",
    );

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(StatusCodes.CREATED).json(result);
  },
);

const confirmPurchase = catchFunction(async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Session ID is required",
    });
  }

  const result = await purchaseService.confirmPurchase(sessionId);
  res.status(StatusCodes.OK).json(result);
});

const getPurchaseHistory = catchFunction(
  async (req: Request, res: Response) => {
    const result = await purchaseService.getPurchaseHistory(req.user.userId);
    res.status(StatusCodes.OK).json(result);
  },
);

const checkPurchase = catchFunction(async (req: Request, res: Response) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Movie ID is required",
    });
  }

  const result = await purchaseService.checkPurchase(
    movieId as string,
    req.user.userId,
    req.user.role,
  );
  res.status(StatusCodes.OK).json(result);
});

const cancelRental = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Purchase ID is required",
    });
  }

  const result = await purchaseService.cancelRental(
    id as string,
    req.user.userId,
  );
  res.status(StatusCodes.OK).json(result);
});

const getAllPurchases = catchFunction(async (req: Request, res: Response) => {
  const result = await purchaseService.getAllPurchases();
  res.status(StatusCodes.OK).json(result);
});

export const purchaseController = {
  createPurchaseCheckout,
  confirmPurchase,
  getPurchaseHistory,
  getAllPurchases,
  checkPurchase,
  cancelRental,
};
