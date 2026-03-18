import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";
import { zodValidation } from "../../middleware/zod.validation";
import { IAdminUpdateValidation } from "./admin.validation";

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
