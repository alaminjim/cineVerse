import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";

import { UserRole } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router();

router.get("/", authMiddleware(UserRole.USER), userController.getUserDashboard);

router.get("/all", authMiddleware(UserRole.ADMIN), userController.getAllUsers);

router.get(
  "/stats",
  authMiddleware(UserRole.USER),
  userController.getUserStats,
);

router.get(
  "/profile",
  authMiddleware(UserRole.USER),
  userController.getUserProfile,
);

router.patch(
  "/update-profile",
  authMiddleware(UserRole.USER),
  userController.updateUserProfile,
);

export const userRoute = router;
