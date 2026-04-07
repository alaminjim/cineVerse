import { Request, Response } from "express";
import { aiService } from "./ai.service.js";
import { prisma } from "../../lib/prisma.js";

/**
 * AI Controller: Routes requests to the AI Service.
 * Explained for User: 
 * - Eta holo AI-er sathe jogajog korar maddhom. 
 * - "getRecommendations" user er taste onujayi movie khuje dey.
 * - "generateSynopsis" admin er jonno synopsis baniye dey.
 */

const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // Using userId from auth
    const { prompt } = req.body;

    let userInterests: string[] = [];

    if (userId) {
      // Fetch user interests
      const [reviews, watchlist] = await Promise.all([
        prisma.review.findMany({ where: { userId }, select: { movie: { select: { title: true } } } }),
        prisma.watchlist.findMany({ where: { userId }, select: { movie: { select: { title: true } } } }),
      ]);

      userInterests = [
        ...reviews.map((r: any) => r.movie.title),
        ...watchlist.map((w: any) => w.movie.title)
      ];
    }

    const allMovies = await prisma.movie.findMany({ take: 20, select: { title: true } });
    const movieTitles = allMovies.map(m => m.title);

    // If there's a prompt, we treat it as a conversational/smart search query
    // Otherwise, we do standard personalized recommendations
    const recommendedTitles = await aiService.generateMovieRecommendation(userInterests, movieTitles, prompt);

    // Fetch full details
    const recommendedMovies = await prisma.movie.findMany({
      where: { title: { in: recommendedTitles } },
      select: { id: true, title: true, thumbnail: true, avgRating: true, genre: true }
    });

    res.json({ 
      success: true, 
      data: {
        movies: recommendedMovies,
        recommendation: recommendedTitles.length > 0 ? (prompt ? `Here are some recommendations for "${prompt}"` : "Based on your history...") : "No matches found."
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateSynopsis = async (req: Request, res: Response) => {
  try {
    const { title, director } = req.body;
    if (!title || !director) {
      return res.status(400).json({ success: false, message: "Title and director are required" });
    }

    const synopsis = await aiService.generateSynopsis(title, director);
    res.json({ success: true, data: synopsis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const aiController = {
  getRecommendations,
  generateSynopsis,
};
