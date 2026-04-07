import { Router } from "express";
import { aiController } from "./ai.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { UserRole } from "@prisma/client";

const router = Router();

// CineBuddy Chatbot - conversational AI (works for guests too)
router.post(
  "/chat",
  (req, res, next) => {
    (req as any).isOptional = true;
    next();
  },
  authMiddleware(),
  aiController.chatWithBot
);

// Search suggestions - public endpoint
router.get("/search-suggestions", aiController.searchSuggestions);

// User can get recommendations based on their activity or a custom prompt
router.post(
  "/recommendations",
  (req, res, next) => {
    (req as any).isOptional = true;
    next();
  },
  authMiddleware(),
  aiController.getRecommendations
);

// Only Admin can use AI to generate synopsis
router.post(
  "/generate-synopsis",
  authMiddleware(UserRole.ADMIN),
  aiController.generateSynopsis
);

export const aiRouter = router;
