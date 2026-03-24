import { Router } from "express";
import { purchaseController } from "./purchase.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  purchaseController.createPurchaseCheckout,
);

router.get(
  "/all",
  authMiddleware(UserRole.ADMIN),
  purchaseController.getAllPurchases,
);

router.post("/confirm", purchaseController.confirmPurchase);

router.get(
  "/history",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  purchaseController.getPurchaseHistory,
);

router.get(
  "/check/:movieId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  purchaseController.checkPurchase,
);

router.post(
  "/cancel/:id",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  purchaseController.cancelRental,
);

export const purchaseRoute = router;
