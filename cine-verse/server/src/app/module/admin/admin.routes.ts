import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRole } from "@prisma/client";
import { zodValidation } from "../../middleware/zod.validation.js";
import { IAdminUpdateValidation } from "./admin.validation.js";

const router = Router();

router.get("/", authMiddleware(UserRole.ADMIN), adminController.getAllAdmin);

router.get(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  adminController.getIdByAdmin,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  zodValidation(IAdminUpdateValidation.adminUpdateValidationSchema),
  adminController.updateAdmin,
);

router.put(
  "/:statusId",
  authMiddleware(UserRole.ADMIN),
  adminController.updateStatus,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  adminController.deleteAdmin,
);

export const adminRoute = router;
