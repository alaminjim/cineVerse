import { Router } from "express";
import { purchaseController } from "./purchase.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER),
  purchaseController.createPurchaseCheckout,
);

router.post("/confirm", purchaseController.confirmPurchase);

router.get(
  "/history",
  authMiddleware(UserRole.USER),
  purchaseController.getPurchaseHistory,
);

router.get(
  "/check/:movieId",
  authMiddleware(UserRole.USER),
  purchaseController.checkPurchase,
);

router.post(
  "/cancel/:id",
  authMiddleware(UserRole.USER),
  purchaseController.cancelRental,
);

export const purchaseRoute = router;
