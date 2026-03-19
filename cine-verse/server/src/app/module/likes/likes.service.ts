import { prisma } from "../../lib/prisma";

const likeReview = async (reviewId: string, userId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  if (existingLike) {
    throw new Error("Already liked this review");
  }

  await prisma.like.create({
    data: { userId, reviewId },
  });

  await prisma.review.update({
    where: { id: reviewId },
    data: { likesCount: { increment: 1 } },
  });

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { likesCount: true },
  });

  return review;
};

const unlikeReview = async (reviewId: string, userId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  if (!existingLike) {
    throw new Error("You haven't liked this review");
  }

  await prisma.like.delete({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  await prisma.review.update({
    where: { id: reviewId },
    data: { likesCount: { decrement: 1 } },
  });

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { likesCount: true },
  });

  return review;
};

const isLiked = async (reviewId: string, userId: string) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  return like;
};

export const likeService = {
  likeReview,
  unlikeReview,
  isLiked,
};
