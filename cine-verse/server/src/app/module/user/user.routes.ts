import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";

import { UserRole } from "@prisma/client";
import { userController } from "./user.controller.js";

const router = Router();

router.get("/", authMiddleware(UserRole.USER, UserRole.ADMIN), userController.getUserDashboard);

router.get("/all", authMiddleware(UserRole.ADMIN), userController.getAllUsers);

router.get(
  "/stats",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  userController.getUserStats,
);

router.get(
  "/profile",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  userController.getUserProfile,
);

router.patch(
  "/update-profile",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  userController.updateUserProfile,
);

export const userRoute = router;
