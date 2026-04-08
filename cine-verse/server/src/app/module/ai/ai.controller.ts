import { Request, Response } from "express";
import { aiService } from "./ai.service.js";
import { prisma } from "../../lib/prisma.js";

/**
 * AI Controller: Routes requests to the AI Service.
 * - chatWithBot: Conversational CineBuddy chatbot
 * - getRecommendations: Movie recommendations
 * - generateSynopsis: Admin synopsis generation
 * - searchSuggestions: AI-powered search suggestions
 */

const chatWithBot = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.userId;
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let userInterests: string[] = [];

    if (userId) {
      try {
        const [reviews, watchlist] = await Promise.all([
          prisma.review.findMany({
            where: { userId },
            select: { movie: { select: { title: true } } },
            take: 10,
          }),
          prisma.watchlist.findMany({
            where: { userId },
            select: { movie: { select: { title: true } } },
            take: 10,
          }),
        ]);

        userInterests = [
          ...reviews.map((r: any) => r.movie?.title).filter(Boolean),
          ...watchlist.map((w: any) => w.movie?.title).filter(Boolean),
        ];
      } catch (err) {
        console.error("Error fetching user interests:", err);
      }
    }

    const allMovies = await prisma.movie.findMany({
      take: 50,
      select: { title: true, releaseYear: true, genre: true },
      orderBy: { createdAt: "desc" }, // Order by newest movies so the AI sees "new releases" easily
    });

    const moviesContext = allMovies.map((m) => `${m.title} (${m.releaseYear || "N/A"}) - ${m.genre.slice(0, 2).join(", ")}`);

    const reply = await aiService.chatWithCineBuddy(
      message.trim(),
      history,
      moviesContext,
      userInterests
    );

    res.json({
      success: true,
      data: { reply },
    });
  } catch (error: any) {
    console.error("CineBuddy Chat Error:", error);
    res.json({
      success: true,
      data: {
        reply:
          "Oops! My projector just flickered 🎥 Give me a moment and try again!",
      },
    });
  }
};

const searchSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim().length < 1) {
      return res.json({ success: true, data: [] });
    }

    // First, do a direct database search (fast)
    const dbResults = await prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: query.trim(), mode: "insensitive" } },
          { director: { contains: query.trim(), mode: "insensitive" } },
          { genre: { hasSome: [query.trim()] } },
          { cast: { hasSome: [query.trim()] } },
        ],
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        avgRating: true,
        genre: true,
        releaseYear: true,
        type: true,
      },
      take: 8,
      orderBy: { avgRating: "desc" },
    });

    res.json({
      success: true,
      data: dbResults,
    });
  } catch (error: any) {
    console.error("Search Suggestions Error:", error);
    res.json({ success: true, data: [] });
  }
};

const getRecommendations = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.userId;
    const { prompt } = req.body;

    let userInterests: string[] = [];

    if (userId) {
      try {
        const [reviews, watchlist] = await Promise.all([
          prisma.review.findMany({
            where: { userId },
            select: { movie: { select: { title: true } } },
          }),
          prisma.watchlist.findMany({
            where: { userId },
            select: { movie: { select: { title: true } } },
          }),
        ]);

        userInterests = [
          ...reviews.map((r: any) => r.movie?.title).filter(Boolean),
          ...watchlist.map((w: any) => w.movie?.title).filter(Boolean),
        ];
      } catch (err) {
        console.error("Error fetching user interests:", err);
      }
    }

    const allMovies = await prisma.movie.findMany({
      take: 20,
      select: { title: true },
    });

    if (!allMovies || allMovies.length === 0) {
      return res.json({
        success: true,
        data: {
          movies: [],
          recommendation:
            "I couldn't find any movies in our library right now.",
        },
      });
    }

    const movieTitles = allMovies.map((m) => m.title);

    try {
      const recommendedTitles =
        await aiService.generateMovieRecommendation(
          userInterests,
          movieTitles,
          prompt
        );

      const recommendedMovies = await prisma.movie.findMany({
        where: { title: { in: recommendedTitles } },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          avgRating: true,
          genre: true,
        },
      });

      res.json({
        success: true,
        data: {
          movies: recommendedMovies,
          recommendation:
            recommendedMovies.length > 0
              ? prompt
                ? `Here are some recommendations for "${prompt}"`
                : "Based on your activity, you might like these:"
              : "I couldn't find exact matches, but check out our latest collection!",
        },
      });
    } catch (aiErr: any) {
      console.error("AI Service Error:", aiErr);
      res.status(200).json({
        success: true,
        data: {
          movies: [],
          recommendation: `CineBuddy Error: ${aiErr.message || "Unknown issue"}. Please try again later!`,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateSynopsis = async (req: Request, res: Response) => {
  try {
    const { title, director, type, genre } = req.body;
    if (!title || !director) {
      return res
        .status(400)
        .json({ success: false, message: "Title and director are required" });
    }

    const synopsis = await aiService.generateSynopsis(title, director, type || "movie", genre || "general");
    res.json({ success: true, data: synopsis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const aiController = {
  chatWithBot,
  searchSuggestions,
  getRecommendations,
  generateSynopsis,
};
