/* eslint-disable @typescript-eslint/no-explicit-any */
import { envConfig } from "../config/env.js";
import { jwtUtils } from "../utils/jwt.js";
import { cookieUtils } from "../utils/cookie.js";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { UserRole, UserStatus } from "@prisma/client";

export const authMiddleware =
  (...userRole: UserRole[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let accessToken = cookieUtils.getCookies(req, "accessToken");
        const sessionToken = cookieUtils.getCookies(
          req,
          "better-auth.session_token",
        );

        if (!accessToken && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
          accessToken = req.headers.authorization.split(" ")[1];
        }

        if (!accessToken && !sessionToken) {
          const error: any = new Error("Unauthorized access! No tokens provided.");
          error.statusCode = 401;
          throw error;
        }

        let userData: any = null;

        if (accessToken) {
          const verificationToken = jwtUtils.verifiedToken(
            accessToken,
            envConfig.ACCESS_TOKEN,
          );

          if (verificationToken.success) {
            userData = verificationToken.verified;
          }
        }

        if (!userData && sessionToken) {
          const sessionInDb = await prisma.session.findFirst({
            where: {
              token: sessionToken,
              expiresAt: { gt: new Date() },
            },
            include: { user: true },
          });

          if (sessionInDb?.user) {
            userData = {
              userId: sessionInDb.user.id,
              role: sessionInDb.user.role,
              email: sessionInDb.user.email,
              status: sessionInDb.user.status,
              isDeleted: sessionInDb.user.isDeleted,
            };
          }
        }

        if (!userData) {
          const error: any = new Error("Unauthorized access! Invalid session.");
          error.statusCode = 401;
          throw error;
        }

        if (userData.status === UserStatus.SUSPENDED || userData.isDeleted) {
          const error: any = new Error("Unauthorized access! User is not active.");
          error.statusCode = 403;
          throw error;
        }

        if (
          userRole.length > 0 &&
          !userRole.includes(userData.role as UserRole)
        ) {
          const error: any = new Error(
            "Forbidden access! You don't have permission.",
          );
          error.statusCode = 403;
          throw error;
        }

        req.user = userData;
        next();
      } catch (error) {
        next(error);
      }
    };
