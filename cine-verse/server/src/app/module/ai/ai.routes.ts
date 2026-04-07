import { Router } from "express";
import { aiController } from "./ai.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRole } from "@prisma/client";

const router = Router();

// User can get recommendations based on their activity
router.get("/recommendations", authMiddleware(UserRole.USER, UserRole.ADMIN), aiController.getRecommendations);

// Only Admin can use AI to generate synopsis
router.post("/generate-synopsis", authMiddleware(UserRole.ADMIN), aiController.generateSynopsis);

export const aiRouter = router;
