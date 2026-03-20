import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { setCookieUtils } from "../../utils/cookiesSet";
import { cookieUtils } from "../../utils/cookie";
import { envConfig } from "../../config/env";
import { auth } from "../../lib/auth";

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

const googleLogin = catchFunction(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/dashboard";

  const encodedRedirect = encodeURIComponent(redirectPath as string);

  const callbackURL = `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirect}`;

  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envConfig.BETTER_AUTH_URL,
  });
});

const googleLoginSuccess = catchFunction(
  async (req: Request, res: Response) => {
    const redirectPath = (req.query.redirect as string) || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if (!sessionToken) {
      return res.redirect(`${envConfig.FRONTEND_URL}/login?error=oAuth-failed`);
    }

    const session = await auth.api.getSession({
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!session) {
      return res.redirect(
        `${envConfig.FRONTEND_URL}/login?error=session_not_found`,
      );
    }

    if (session && !session.user) {
      return res.redirect(
        `${envConfig.FRONTEND_URL}/login?error=user_not_found`,
      );
    }

    const result = await authService.googleLoginSuccess(session);

    const { accessToken, refreshToken } = result;

    setCookieUtils.setAccessToken(res, accessToken);
    setCookieUtils.setRefreshToken(res, refreshToken);

    const isValidRedirectPath =
      redirectPath.startsWith("/") && !redirectPath.startsWith("//");

    const finalPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envConfig.FRONTEND_URL}${finalPath}`);
  },
);

export const authController = {
  authRegister,
  authLogin,
  authMe,
  logOut,
  googleLogin,
  googleLoginSuccess,
};
