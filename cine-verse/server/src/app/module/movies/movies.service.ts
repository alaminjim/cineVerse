/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { uploadImage } from "../../config/cloudinary.config";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";

const toNumber = (val: any) => {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const createMovie = async (payload: any, file?: Express.Multer.File) => {
  let thumbnail = null;

  if (file) {
    thumbnail = await uploadImage(file);
  }

  if (!payload.title || !payload.director) {
    throw new Error("Title and director are required");
  }

  if (!["MOVIE", "SERIES"].includes(payload.type)) {
    throw new Error("Invalid type");
  }

  if (payload.type === "SERIES") {
    if (!payload.seasons || !payload.episodes) {
      throw new Error("Seasons and episodes required for series");
    }
  }

  if (payload.type === "MOVIE") {
    if (!payload.runtime) {
      throw new Error("Runtime required for movies");
    }
  }

  let stripeBuyPriceId = null;
  let stripeRentPriceId = null;
  let buyPrice = null;
  let rentPrice = null;

  if (payload.pricing === "PREMIUM") {
    buyPrice = payload.buyPrice || 1500;
    rentPrice = payload.rentPrice || 500;

    const product = await stripe.products.create({
      name: payload.title,
      description: payload.synopsis,
      images: thumbnail ? [thumbnail] : undefined,
    });

    const buyPriceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(buyPrice),
      currency: "bdt",
    });

    const rentPriceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(rentPrice),
      currency: "bdt",
    });

    stripeBuyPriceId = buyPriceObj.id;
    stripeRentPriceId = rentPriceObj.id;
  }

  const movie = await prisma.movie.create({
    data: {
      title: payload.title,
      synopsis: payload.synopsis,
      thumbnail,
      genre: payload.genre || [],
      releaseYear: payload.releaseYear,
      director: payload.director,
      cast: payload.cast || [],
      streamingPlatform: payload.streamingPlatform || [],

      type: payload.type,

      seasons: payload.type === "SERIES" ? toNumber(payload.seasons) : null,
      episodes: payload.type === "SERIES" ? toNumber(payload.episodes) : null,
      runtime: payload.type === "MOVIE" ? toNumber(payload.runtime) : null,

      streamingLink: payload.streamingLink || null,

      pricing: payload.pricing,
      buyPrice,
      rentPrice,
      stripeBuyPriceId,
      stripeRentPriceId,
    },
  });

  return movie;
};

const getAllMovies = async (queryParams: any) => {
  const {
    searchTerms,
    genre,
    type,
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

  if (type) where.type = type;

  if (searchTerms) {
    where.OR = [
      { title: { contains: searchTerms, mode: "insensitive" } },
      { director: { contains: searchTerms, mode: "insensitive" } },
      { cast: { hasSome: [searchTerms] } },
    ];
  }

  if (genre) where.genre = { hasSome: [genre] };
  if (director) where.director = { contains: director, mode: "insensitive" };
  if (releaseYear) where.releaseYear = parseInt(releaseYear);

  if (ratingFrom || ratingTo) {
    where.avgRating = {};
    if (ratingFrom) where.avgRating.gte = parseFloat(ratingFrom);
    if (ratingTo) where.avgRating.lte = parseFloat(ratingTo);
  }

  if (popularity) where.reviewCount = { gte: parseInt(popularity) };

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
      select: {
        id: true,
        title: true,
        synopsis: true,
        thumbnail: true,
        genre: true,
        releaseYear: true,
        type: true,
        pricing: true,
        avgRating: true,
        reviewCount: true,
        director: true,
        streamingPlatform: true,
        streamingLink: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    }),
  ]);

  return {
    success: true,
    data: movies,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getMovieById = async (id: string) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { status: "APPROVED" },
        select: {
          id: true,
          title: true,
          rating: true,
          content: true,
          hasSpoiler: true,
          tags: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  return {
    success: true,
    data: {
      ...movie,
      reviews: movie.reviews.map((review) => ({
        ...review,
        likesCount: review._count.likes,
        commentsCount: review._count.comments,
        _count: undefined,
      })),
    },
  };
};

const updateMovie = async (id: string, payload: any) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  const updateData: any = {};

  if (payload.title) updateData.title = payload.title;
  if (payload.synopsis) updateData.synopsis = payload.synopsis;
  if (payload.thumbnail) updateData.thumbnail = payload.thumbnail;
  if (payload.genre) updateData.genre = payload.genre;
  if (payload.releaseYear) updateData.releaseYear = Number(payload.releaseYear);
  if (payload.director) updateData.director = payload.director;
  if (payload.cast) updateData.cast = payload.cast;
  if (payload.streamingPlatform)
    updateData.streamingPlatform = payload.streamingPlatform;
  if (payload.streamingLink) updateData.streamingLink = payload.streamingLink;
  if (payload.pricing) updateData.pricing = payload.pricing;

  if (payload.type) {
    updateData.type = payload.type;

    if (payload.type === "SERIES") {
      if (payload.seasons) updateData.seasons = toNumber(payload.seasons);
      if (payload.episodes) updateData.episodes = toNumber(payload.episodes);
      updateData.runtime = null;
    }

    if (payload.type === "MOVIE") {
      if (payload.runtime) updateData.runtime = toNumber(payload.runtime);
      updateData.seasons = null;
      updateData.episodes = null;
    }
  }

  const updated = await prisma.movie.update({
    where: { id },
    data: updateData,
  });

  return updated;
};

const getFeaturedMovies = async () => {
  const movies = await prisma.movie.findMany({
    where: { avgRating: { gte: 8 } },
    orderBy: { avgRating: "desc" },
    take: 10,
  });

  return movies;
};

const getNewReleases = async () => {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return movies;
};

const deleteMovie = async (id: string) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  if (movie.stripeBuyPriceId) {
    await stripe.prices.update(movie.stripeBuyPriceId, {
      active: false,
    });
  }

  if (movie.stripeRentPriceId) {
    await stripe.prices.update(movie.stripeRentPriceId, {
      active: false,
    });
  }

  const deleted = await prisma.movie.delete({
    where: { id },
  });

  return deleted;
};

export const movieService = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  getFeaturedMovies,
  getNewReleases,
  deleteMovie,
};
