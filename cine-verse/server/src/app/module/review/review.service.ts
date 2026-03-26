/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { ReviewStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const createReview = async (userId: string, userRole: string, payload: any) => {
  const { movieId, title, rating, content, hasSpoiler, tags } = payload;

  if (!movieId || !title || !rating || !content) {
    throw new Error("All fields are required");
  }

  if (rating < 1 || rating > 10) {
    throw new Error("Rating must be between 1 and 10");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      movieId,
    },
  });

  if (existingReview) {
    throw new Error("You already reviewed this movie");
  }

  const status = userRole === "ADMIN" || userRole === "SUPER_ADMIN" 
    ? ReviewStatus.APPROVED 
    : ReviewStatus.PENDING;

  const review = await prisma.review.create({
    data: {
      userId,
      movieId,
      title,
      rating,
      content,
      hasSpoiler: hasSpoiler || false,
      tags: tags || [],
      status,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (status === ReviewStatus.APPROVED) {
    await updateMovieRating(movieId);
  }

  return {
    ...review,
    message: status === ReviewStatus.PENDING 
      ? "Review submitted successfully and is pending admin approval." 
      : "Review published successfully."
  };
};

const getReviewsByMovieId = async (movieId: string, queryParams: any) => {
  const { page = 1, limit = 10 } = queryParams;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [total, reviews] = await Promise.all([
    prisma.review.count({
      where: {
        movieId,
        status: "APPROVED",
      },
    }),
    prisma.review.findMany({
      where: {
        movieId,
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    }),
  ]);

  return {
    success: true,
    data: reviews.map((review: any) => ({
      ...review,
      likesCount: review.likes.length,
      commentsCount: review.comments.length,
      likes: undefined,
    })),
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getReviewById = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      likes: true,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return {
    success: true,
    data: review,
  };
};

const updateReview = async (reviewId: string, userId: string, payload: any) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("You can only edit your own review");
  }

  if (review.status === "APPROVED") {
    throw new Error("Cannot edit approved reviews");
  }

  const updateData: any = {};

  if (payload.title) updateData.title = payload.title;
  if (payload.rating) {
    if (payload.rating < 1 || payload.rating > 10) {
      throw new Error("Rating must be between 1 and 10");
    }
    updateData.rating = payload.rating;
  }
  if (payload.content) updateData.content = payload.content;

  if (payload.hasSpoiler !== undefined) {
    updateData.hasSpoiler = payload.hasSpoiler;
  }

  if (payload.tags) {
    updateData.tags = payload.tags;
  }

  updateData.status = "PENDING";

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Review updated. Pending admin approval.",
    data: updated,
  };
};

const deleteReview = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("You can only delete your own review");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  await updateMovieRating(review.movieId);

  return {
    success: true,
  };
};

const updateMovieRating = async (movieId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      movieId,
    },
    select: {
      rating: true,
    },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    },
  });
};

const getPendingReviews = async (queryParams: any) => {
  const { page = 1, limit = 10 } = queryParams;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [total, reviews] = await Promise.all([
    prisma.review.count({
      where: { status: "PENDING" },
    }),
    prisma.review.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    }),
  ]);

  return {
    success: true,
    data: reviews,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const approveReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.status === "APPROVED") {
    throw new Error("Review is already approved");
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { status: "APPROVED" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  await updateMovieRating(review.movieId);

  return updated;
};

const rejectReview = async (reviewId: string, reason?: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.status === "REJECTED") {
    throw new Error("Review is already rejected");
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { status: "REJECTED" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (review.status === "APPROVED") {
    await updateMovieRating(review.movieId);
  }

  return updated;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, image: true } },
      movie: { select: { title: true, thumbnail: true } },
    },
  });
  return reviews;
};

const getRecentApprovedReviews = async (limit = 10) => {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { name: true, image: true } },
      movie: { select: { title: true, thumbnail: true } },
    },
  });
  return reviews;
};

const syncRatings = async () => {
  const movies = await prisma.movie.findMany({
    select: { id: true },
  });

  for (const movie of movies) {
    await updateMovieRating(movie.id);
  }

  return {
    success: true,
    message: "All movie ratings synchronized successfully",
  };
};

export const reviewService = {
  createReview,
  getReviewsByMovieId,
  getReviewById,
  updateReview,
  deleteReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  getAllReviews,
  getRecentApprovedReviews,
  syncRatings,
};
