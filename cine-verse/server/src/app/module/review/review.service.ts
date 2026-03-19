import { ReviewStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReview, IUpdateReview } from "./review.interface";

const createReview = async (payload: ICreateReview, user: IRequestUser) => {
  const userId = user.userId;
  const existing = await prisma.review.findFirst({
    where: {
      movieId: payload.movieId,
      userId,
    },
  });

  if (existing) {
    throw new Error("You already reviewed this movie");
  }

  if (user.role !== "USER") {
    throw new Error("Only Admin can create");
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
      userId,
      status: ReviewStatus.PENDING,
      tags: payload.tags || [],
      hasSpoiler: payload.hasSpoiler || false,
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return review;
};

const getMovieReviews = async (movieId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      movieId,
      status: ReviewStatus.APPROVED,
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

const updateReview = async (
  reviewId: string,
  payload: IUpdateReview,
  userId: string,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Only review owner can edit");
  }

  if (review.status === "APPROVED") {
    throw new Error("Cannot edit approved review");
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return updated;
};

const deleteReview = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Only review owner can delete");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  await recalculateMovieRating(review.movieId);

  return { success: true };
};

const recalculateMovieRating = async (movieId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      movieId,
      status: ReviewStatus.APPROVED,
    },
    select: { rating: true },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    },
  });
};

const getPendingReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: { status: ReviewStatus.PENDING },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      movie: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return reviews;
};

const approveReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  const approved = await prisma.review.update({
    where: { id: reviewId },
    data: { status: ReviewStatus.APPROVED },
  });

  await recalculateMovieRating(review.movieId);

  return approved;
};

const rejectReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: { status: ReviewStatus.REJECTED },
  });

  return { success: true };
};

export const reviewService = {
  createReview,
  getMovieReviews,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getAllReviews,
  getPendingReviews,
};
