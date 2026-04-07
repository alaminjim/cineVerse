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
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user interests (movies they reviewed or added to watchlist)
    const [reviews, watchlist] = await Promise.all([
      prisma.review.findMany({ where: { userId }, select: { movie: { select: { title: true } } } }),
      prisma.watchlist.findMany({ where: { userId }, select: { movie: { select: { title: true } } } }),
    ]);

    const userInterests = [
      ...reviews.map((r: any) => r.movie.title),
      ...watchlist.map((w: any) => w.movie.title)
    ];

    // Get all available movie titles for AI to choose from
    const allMovies = await prisma.movie.findMany({ select: { title: true } });
    const movieTitles = allMovies.map(m => m.title);

    const recommendedTitles = await aiService.generateMovieRecommendation(userInterests, movieTitles);

    // Fetch full movie details for the recommended titles
    const recommendedMovies = await prisma.movie.findMany({
      where: { title: { in: recommendedTitles } },
      select: { id: true, title: true, thumbnail: true, avgRating: true, genre: true }
    });

    res.json({ success: true, data: recommendedMovies });
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
