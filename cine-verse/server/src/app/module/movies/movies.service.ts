/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { uploadImage } from "../../config/cloudinary.config";
import { stripe } from "../../config/stripe";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateMovie, IUpdateMovie } from "./movies.interface";

const createMovie = async (
  payload: ICreateMovie,
  user: IRequestUser,
  file?: Express.Multer.File,
) => {
  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can create movies");
  }

  let thumbnail: string | undefined;
  if (file) {
    thumbnail = await uploadImage(file);
  }

  let stripeBuyPriceId: string | null = null;
  let stripeRentPriceId: string | null = null;

  if (payload.pricing === "PREMIUM") {
    try {
      const buyPrice = payload.buyPrice || 299;
      const rentPrice = payload.rentPrice || 499;

      const product = await stripe.products.create({
        name: payload.title,
        images: thumbnail ? [thumbnail] : [],
        metadata: {
          title: payload.title,
          genre: payload.genre?.join(",") || "Unknown",
          director: payload.director || "Unknown",
        },
      });

      const buyPriceObj = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(buyPrice * 100),
        currency: "bdt",
        metadata: {
          type: "BUY",
          title: payload.title,
        },
      });
      stripeBuyPriceId = buyPriceObj.id;

      const rentPriceObj = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(rentPrice * 100),
        currency: "usd",
        metadata: {
          type: "RENT",
          duration: "7_days",
          title: payload.title,
        },
      });
      stripeRentPriceId = rentPriceObj.id;
    } catch (error) {
      console.error("Stripe product creation error:", error);
    }
  }

  const movie = await prisma.movie.create({
    data: {
      title: payload.title,
      synopsis: payload.synopsis,
      thumbnail,
      genre: payload.genre,
      releaseYear: payload.releaseYear,
      director: payload.director,
      cast: payload.cast,
      streamingPlatform: payload.streamingPlatform,
      pricing: payload.pricing,
      stripeBuyPriceId,
      stripeRentPriceId,
    },
    include: {
      _count: {
        select: { reviews: true },
      },
    },
  });

  return movie;
};

const getAllMovies = async (queryParams: any) => {
  const {
    searchTerms,
    genre,
    director,
    releaseYear,
    ratingFrom,
    ratingTo,
    popularity,
    sortBy = "avgRating",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = queryParams;

  const where: any = {};

  if (searchTerms) {
    where.OR = [
      { title: { contains: searchTerms, mode: "insensitive" } },
      { director: { contains: searchTerms, mode: "insensitive" } },
      { cast: { hasSome: [searchTerms] } },
      { streamingPlatform: { hasSome: [searchTerms] } },
    ];
  }

  if (genre) {
    where.genre = { hasSome: [genre] };
  }

  if (director) {
    where.director = {
      contains: director,
      mode: "insensitive",
    };
  }

  if (releaseYear) {
    where.releaseYear = parseInt(releaseYear);
  }

  if (ratingFrom || ratingTo) {
    where.avgRating = {};
    if (ratingFrom) where.avgRating.gte = parseFloat(ratingFrom);
    if (ratingTo) where.avgRating.lte = parseFloat(ratingTo);
  }

  if (popularity) {
    where.reviewCount = { gte: parseInt(popularity) };
  }

  let orderBy: any = {};
  switch (sortBy) {
    case "avgRating":
      orderBy = { avgRating: sortOrder };
      break;
    case "reviewCount":
      orderBy = { reviewCount: sortOrder };
      break;
    case "createdAt":
      orderBy = { createdAt: sortOrder };
      break;
    case "releaseYear":
      orderBy = { releaseYear: sortOrder };
      break;
    default:
      orderBy = { avgRating: sortOrder };
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [total, movies] = await Promise.all([
    prisma.movie.count({ where }),
    prisma.movie.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        reviews: true,
        _count: {
          select: { reviews: true, watchlists: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    success: true,
    data: movies,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const getMovieById = async (movieId: string) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      reviews: {
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

const updateMovieBuyPrice = async (movieId: string, newBuyPrice: number) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  if (movie.pricing !== "PREMIUM") {
    throw new Error("Only PREMIUM movies have buy price");
  }

  if (!movie.stripeBuyPriceId) {
    throw new Error("Movie does not have buy price configured");
  }

  const currentPrice = await stripe.prices.retrieve(movie.stripeBuyPriceId);
  const productId = currentPrice.product as string;

  const newPriceObj = await stripe.prices.create({
    product: productId,
    unit_amount: Math.round(newBuyPrice * 100),
    currency: "bdt",
    metadata: {
      type: "BUY",
      title: movie.title,
      updatedAt: new Date().toISOString(),
    },
  });

  const updated = await prisma.movie.update({
    where: { id: movieId },
    data: {
      stripeBuyPriceId: newPriceObj.id,
    },
  });

  return {
    success: true,
    message: "Buy price updated successfully",
    data: {
      movieId,
      newPrice: newBuyPrice,
      stripeBuyPriceId: newPriceObj.id,
    },
  };
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
  updateMovieBuyPrice,
  deleteMovie,
};
