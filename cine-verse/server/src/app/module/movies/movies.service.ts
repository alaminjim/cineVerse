import { uploadImage } from "../../config/cloudinary.config";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateMovie, IUpdateMovie } from "./movies.interface";

const createMovie = async (
  payload: ICreateMovie,
  user: IRequestUser,
  file?: Express.Multer.File,
) => {
  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can create this movies");
  }

  let thumbnail: string | undefined;
  if (file) {
    thumbnail = await uploadImage(file);
  }

  const movie = await prisma.movie.create({
    data: {
      ...payload,
      thumbnail,
    },
    include: {
      _count: {
        select: { reviews: true },
      },
    },
  });

  return movie;
};

const getAllMovies = async () => {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    data: movies,
  };
};

const getMovieById = async (movieId: string) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      reviews: {
        where: { status: "APPROVED" },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          tags: true,
          hasSpoiler: true,
          likesCount: true,
          commentCount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
          watchlists: true,
        },
      },
    },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  return {
    success: true,
    data: movie,
  };
};

const getNewReleases = async () => {
  const newReleases = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      synopsis: true,
      thumbnail: true,
      releaseYear: true,
      genre: true,
      avgRating: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    data: newReleases,
  };
};

const getFeaturedMovies = async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const featured = await prisma.movie.findMany({
    where: {
      reviews: {
        some: {
          createdAt: { gte: threeDaysAgo },
          status: "APPROVED",
        },
      },
    },

    orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }],
  });

  return featured;
};

const updateMovie = async (
  movieId: string,
  payload: IUpdateMovie,
  user: IRequestUser,
  file?: Express.Multer.File,
) => {
  if (!(await prisma.movie.findFirst({ where: { id: movieId } }))) {
    throw new Error("Movie not found");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can update movies");
  }

  let thumbnail: string | undefined;

  if (file) {
    thumbnail = await uploadImage(file);
  }

  const data = thumbnail ? { ...payload, thumbnail } : payload;

  const movie = await prisma.movie.update({
    where: { id: movieId },
    data,
  });

  return movie;
};

const deleteMovie = async (movieId: string, user: IRequestUser) => {
  const isExists = await prisma.movie.findFirst({
    where: {
      id: movieId,
    },
  });

  if (!isExists) {
    throw new Error("This Movie Does not exists");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can delete this movies");
  }

  return await prisma.movie.delete({
    where: { id: movieId },
  });
};

export const movieService = {
  createMovie,
  getAllMovies,
  getMovieById,
  getNewReleases,
  getFeaturedMovies,
  updateMovie,
  deleteMovie,
};
