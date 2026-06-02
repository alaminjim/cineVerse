import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction.js";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service.js";
import { setCookieUtils } from "../../utils/cookiesSet.js";
import { cookieUtils } from "../../utils/cookie.js";
import { envConfig } from "../../config/env.js";
import { auth } from "../../lib/auth.js";

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

  const isProduction = process.env.NODE_ENV === "production";

  cookieUtils.clearCookies(res, "accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  cookieUtils.clearCookies(res, "refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  cookieUtils.clearCookies(res, "better-auth.session_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "logout SuccessFul",
    data: null,
  });
});

const googleLogin = catchFunction(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/";

  const encodedRedirect = encodeURIComponent(redirectPath as string);

  const callbackURL = `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirect}`;

  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envConfig.BETTER_AUTH_URL,
  });
});

const googleLoginSuccess = catchFunction(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies["better-auth.session_token"];

    if (!sessionToken) {
      return res.redirect(`${envConfig.FRONTEND_URL}/login?error=oAuth-failed`);
    }

    const session = await auth.api.getSession({
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!session || !session.user) {
      return res.redirect(
        `${envConfig.FRONTEND_URL}/login?error=user_not_found`,
      );
    }

    const result = await authService.googleLoginSuccess(session);
    const { accessToken, refreshToken } = result;

    setCookieUtils.setAccessToken(res, accessToken);
    setCookieUtils.setRefreshToken(res, refreshToken);
    setCookieUtils.setBetterAuthToken(res, sessionToken);

    let redirectPath = (req.query.redirect as string) || "/";
    if (!redirectPath.startsWith("/")) redirectPath = "/";

    const finalURL = `${envConfig.FRONTEND_URL}/oauth?mode=login&token=${accessToken}&redirect=${encodeURIComponent(redirectPath)}`;

    res.redirect(finalURL);
  },
);

const forgotPassword = catchFunction(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Forgot password SuccessFul",
  });
});

const resetPassword = catchFunction(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Password Reset SuccessFul",
  });
});

export const authController = {
  authRegister,
  authLogin,
  authMe,
  logOut,
  googleLogin,
  googleLoginSuccess,
  forgotPassword,
  resetPassword,
};
