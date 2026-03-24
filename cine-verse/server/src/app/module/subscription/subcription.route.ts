import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { subscriptionController } from "./subcription.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),

  subscriptionController.createSubscription,
);

router.get(
  "/active",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  subscriptionController.getActiveSubscription,
);

router.get(
  "/all",
  authMiddleware(UserRole.ADMIN),
  subscriptionController.getAllSubscriptions,
);

router.post("/confirm", subscriptionController.confirmSubscription);

router.post(
  "/:id",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  subscriptionController.cancelSubscription,
);

export const subscriptionRoute = router;
