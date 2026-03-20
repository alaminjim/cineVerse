/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/modules/admin/analytics/analytics.service.ts

import { prisma } from "../../../lib/prisma";

const getAnalyticsStats = async () => {
  try {
    const totalMovies = await prisma.movie.count();
    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });
    const totalReviews = await prisma.review.count();
    const totalSubscriptions = await prisma.subscription.count({
      where: { status: "ACTIVE" },
    });
    const totalPurchases = await prisma.purchase.count({
      where: { status: "ACTIVE" },
    });

    const purchaseRevenue = await prisma.purchase.aggregate({
      _sum: { amount: true },
    });

    const topRatedMovies = await prisma.movie.findMany({
      orderBy: { avgRating: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        avgRating: true,
        reviewCount: true,
        thumbnail: true,
      },
    });

    const mostReviewedMovies = await prisma.movie.findMany({
      orderBy: { reviewCount: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        reviewCount: true,
        avgRating: true,
        thumbnail: true,
      },
    });

    const recentUsers = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        image: true,
      },
    });

    return {
      success: true,
      data: {
        totalMovies,
        totalUsers,
        totalReviews,
        totalSubscriptions,
        totalPurchases,
        revenue: {
          purchases: purchaseRevenue._sum.amount || 0,
          total: purchaseRevenue._sum.amount || 0,
        },
        topRatedMovies,
        mostReviewedMovies,
        recentUsers,
      },
    };
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

const getActivityLogs = async (queryParams: any) => {
  const { page = 1, limit = 20 } = queryParams;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  try {
    const [total, logs] = await Promise.all([
      prisma.review.count(),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          rating: true,
          createdAt: true,
          movieId: true,
          userId: true,
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
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const activityLogs = logs.map((log: any) => ({
      id: log.id,
      userId: log.userId,
      action: "Created Review",
      entityType: "Movie",
      entityId: log.movieId,
      entityName: log.movie.title,
      userAction: `${log.user.name} rated "${log.movie.title}" with ${log.rating} stars`,
      createdAt: log.createdAt,
      user: log.user,
    }));

    return {
      success: true,
      data: activityLogs,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Activity logs error:", error);
  }
};

const getPendingReviews = async (queryParams: any) => {
  const { page = 1, limit = 20 } = queryParams;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  try {
    const [total, reviews] = await Promise.all([
      prisma.review.count({
        where: { status: "PENDING" },
      }),
      prisma.review.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        skip,
        take: limitNum,
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
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      success: true,
      data: reviews,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Pending reviews error:", error);
  }
};

const approveReview = async (reviewId: string) => {
  try {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status: "APPROVED" },
      include: {
        user: { select: { name: true } },
        movie: { select: { title: true } },
      },
    });

    return {
      success: true,
      message: "Review approved",
      data: review,
    };
  } catch (error) {
    console.error("Approve review error:", error);
  }
};

const rejectReview = async (reviewId: string, reason?: string) => {
  try {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status: "REJECTED" },
      include: {
        user: { select: { name: true } },
        movie: { select: { title: true } },
      },
    });

    return {
      success: true,
      message: "Review rejected",
      data: review,
    };
  } catch (error) {
    console.error("Reject review error:", error);
  }
};

export const analyticsService = {
  getAnalyticsStats,
  getActivityLogs,
  getPendingReviews,
  approveReview,
  rejectReview,
};
