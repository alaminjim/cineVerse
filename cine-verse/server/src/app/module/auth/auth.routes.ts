import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.authRegister);

router.post("/login", authController.authLogin);

router.get(
  "/me",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  authController.authMe,
);

export const authRoute = router;
