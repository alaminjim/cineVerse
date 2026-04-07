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
    // Use optional chaining carefully
    const user = (req as any).user;
    const userId = user?.userId;
    const { prompt } = req.body;

    let userInterests: string[] = [];

    if (userId) {
      try {
        // Fetch user interests safely
        const [reviews, watchlist] = await Promise.all([
          prisma.review.findMany({ where: { userId }, select: { movie: { select: { title: true } } } }),
          prisma.watchlist.findMany({ where: { userId }, select: { movie: { select: { title: true } } } }),
        ]);

        userInterests = [
          ...reviews.map((r: any) => r.movie?.title).filter(Boolean),
          ...watchlist.map((w: any) => w.movie?.title).filter(Boolean)
        ];
      } catch (err) {
        console.error("Error fetching user interests:", err);
        // Continue as guest if history fetch fails
      }
    }

    // Fetch movies safely
    const allMovies = await prisma.movie.findMany({ 
      take: 20, 
      select: { title: true } 
    });

    if (!allMovies || allMovies.length === 0) {
      return res.json({ 
        success: true, 
        data: { movies: [], recommendation: "I couldn't find any movies in our library right now." } 
      });
    }

    const movieTitles = allMovies.map(m => m.title);

    try {
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
          recommendation: recommendedMovies.length > 0 
            ? (prompt ? `Here are some recommendations for "${prompt}"` : "Based on your activity, you might like these:") 
            : "I couldn't find exact matches, but check out our latest collection!"
        } 
      });
    } catch (aiErr: any) {
      console.error("AI Service Error:", aiErr);
      res.status(200).json({ 
        success: true, 
        data: { 
          movies: [], 
          recommendation: `CineBuddy Error: ${aiErr.message || "Unknown issue"}. Please try again later!` 
        } 
      });
    }
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
