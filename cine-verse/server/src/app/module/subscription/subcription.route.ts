import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { subscriptionController } from "./subcription.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authMiddleware(UserRole.USER),

  subscriptionController.createSubscription,
);

router.get(
  "/active",
  authMiddleware(UserRole.USER),
  subscriptionController.getActiveSubscription,
);

router.post("/confirm", subscriptionController.confirmSubscription);

router.post(
  "/:id",
  authMiddleware(UserRole.USER),
  subscriptionController.cancelSubscription,
);

export const subscriptionRoute = router;
