import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { setCookieUtils } from "../../utils/cookiesSet";
import { cookieUtils } from "../../utils/cookie";

const authRegister = catchFunction(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authRegister(payload);

  const { refreshToken, accessToken, token, ...spread } = result;

  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, refreshToken);
  setCookieUtils.setBetterAuthToken(res, token as string);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      token,
      ...spread,
    },
    message: "Register Successful",
  });
});

const authLogin = catchFunction(async (req: Request, res: Response) => {
  const payload = req.body;
  const authLogin = await authService.authLogin(payload);

  const { refreshToken, accessToken, token, ...spread } = authLogin;

  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, refreshToken);
  setCookieUtils.setBetterAuthToken(res, token);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      token,
      ...spread,
    },
    message: "Login successful",
  });
});

const authMe = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await authService.authMe(user);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const logOut = catchFunction(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];

  await authService.logOut(sessionToken);

  cookieUtils.clearCookies(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  cookieUtils.clearCookies(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  cookieUtils.clearCookies(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "logout SuccessFul",
    data: null,
  });
});

export const authController = {
  authRegister,
  authLogin,
  authMe,
  logOut,
};
