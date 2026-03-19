import { prisma } from "../../lib/prisma";

const addToWatchList = async (movieId: string, userId: string) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (existing) {
    throw new Error("Already in watchlist");
  }

  const watchList = await prisma.watchlist.create({
    data: {
      userId,
      movieId,
    },
  });

  return watchList;
};

const removeFromWatchList = async (movieId: string, userId: string) => {
  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (!existing) {
    throw new Error("Not in watchlist");
  }

  return await prisma.watchlist.delete({
    where: {
      userId_movieId: { userId, movieId },
    },
  });
};

const getWatchList = async (userId: string) => {
  const watchList = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          synopsis: true,
          thumbnail: true,
          genre: true,
          releaseYear: true,
          director: true,
          avgRating: true,
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  return watchList;
};

const isInWatchList = async (movieId: string, userId: string) => {
  const watchList = await prisma.watchlist.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  return {
    success: true,
    isInWatchList: !!watchList,
  };
};

export const watchlistService = {
  addToWatchList,
  removeFromWatchList,
  getWatchList,
  isInWatchList,
};
