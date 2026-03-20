import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";
import { zodValidation } from "../../middleware/zod.validation";
import {
  authLoginValidationSchema,
  authRegisterValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  zodValidation(authRegisterValidationSchema),
  authController.authRegister,
);

router.post(
  "/login",
  zodValidation(authLoginValidationSchema),
  authController.authLogin,
);

router.get(
  "/me",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  authController.authMe,
);

router.post(
  "/logout",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  authController.logOut,
);

export const authRoute = router;
