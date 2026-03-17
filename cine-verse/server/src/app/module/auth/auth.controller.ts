import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";

const authRegister = catchFunction(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authRegister(payload);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result,
    message: "Register Successful",
  });
});

const authLogin = catchFunction(async (req: Request, res: Response) => {
  const payload = req.body;
  const authLogin = await authService.authLogin(payload);

  res.status(StatusCodes.OK).json({
    success: true,
    data: authLogin,
    message: "Login successful",
  });
});

export const authController = {
  authRegister,
  authLogin,
};
