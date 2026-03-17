import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { envConfig } from "../config/env";

import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const authMiddleware =
  (...userRole: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookies(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      const sessionTokenExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!sessionTokenExists || !sessionTokenExists.user) {
        throw new Error("Unauthorized access! Invalid session.");
      }

      const user = sessionTokenExists.user;

      if (
        user.status === UserStatus.SUSPENDED ||
        user.status === UserStatus.DELETED
      ) {
        throw new Error("Unauthorized access! User is not active.");
      }

      if (user.isDeleted) {
        throw new Error("Unauthorized access! User is deleted.");
      }

      if (userRole.length > 0 && !userRole.includes(user.role)) {
        throw new Error(
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      const accessToken = cookieUtils.getCookies(req, "accessToken");

      if (!accessToken) {
        throw new Error("Unauthorized access! No access token provided.");
      }

      const verificationToken = jwtUtils.verifiedToken(
        accessToken,
        envConfig.ACCESS_TOKEN,
      );

      if (!verificationToken.success) {
        throw new Error("Unauthorized access! Invalid access token.");
      }

      if (
        userRole.length > 0 &&
        !userRole.includes(verificationToken.verified!.role as UserRole)
      ) {
        throw new Error(
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
