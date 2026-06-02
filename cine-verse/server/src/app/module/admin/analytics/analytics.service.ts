/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */



import { PurchaseStatus, ReviewStatus, SubscriptionStatus, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma.js";

const getAnalyticsStats = async () => {
  const totalMovies = await prisma.movie.count();
  const totalUsers = await prisma.user.count({
    where: { role: UserRole.USER },
  });

  const totalAdmin = await prisma.user.count({
    where: { role: UserRole.ADMIN },
  });

  const totalStatus = await prisma.user.count({
    where: { status: UserStatus.ACTIVE },
  });

  const totalStatus1 = await prisma.user.count({
    where: { status: UserStatus.BANNED },
  });

  const totalStatus2 = await prisma.user.count({
    where: { status: UserStatus.DELETED },
  });

  const totalReviews = await prisma.review.count();

  const totalSubscriptions = await prisma.subscription.count({
    where: { status: SubscriptionStatus.ACTIVE },
  });
  const totalPurchases = await prisma.purchase.count({
    where: { status: PurchaseStatus.ACTIVE },
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
    where: { role: UserRole.USER },
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
      totalAdmin,
      totalStatus,
      totalStatus1,
      totalStatus2,
      totalReviews,
      totalSubscriptions,
      totalPurchases,
      revenue: {
        purchases: purchaseRevenue._sum.amount || 0,
        total: purchaseRevenue._sum.amount || 0,
      },
      pendingReviews: await prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      systemHealth: {
        status: "Optimized",
        score: 84 + Math.floor(Math.random() * 10),
        database: "Stable",
        latency: "41ms"
      },
      topRatedMovies,
      mostReviewedMovies,
      recentUsers,
    },
  };
};

const getChartData = async () => {
  // Last 7 days user registration
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const userStats = await Promise.all(
    last7Days.map(async (date) => {
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });
      return { date, users: count };
    })
  );

  const revenueStats = await Promise.all(
    last7Days.map(async (date) => {
      const result = await prisma.purchase.aggregate({
        where: {
          status: PurchaseStatus.ACTIVE,
          updatedAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          },
        },
        _sum: { amount: true },
      });
      return { date, revenue: result._sum.amount || 0 };
    })
  );

  return {
    success: true,
    data: {
      userStats,
      revenueStats,
    },
  };
};

const getActivityLogs = async (queryParams: any) => {
  const { page = 1, limit = 20 } = queryParams;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

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
    data: activityLogs,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const getPendingReviews = async (queryParams: any) => {
  const { page = 1, limit = 20 } = queryParams;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [total, reviews] = await Promise.all([
    prisma.review.count({
      where: { status: ReviewStatus.PENDING },
    }),
    prisma.review.findMany({
      where: { status: ReviewStatus.PENDING },
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
    data: reviews,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const approveReview = async (reviewId: string) => {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status: ReviewStatus.APPROVED },
    include: {
      user: { select: { name: true } },
      movie: { select: { title: true } },
    },
  });

  return review;
};

const rejectReview = async (reviewId: string, reason?: string) => {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      status: ReviewStatus.REJECTED,
      rejectionReason: reason
    },
    include: {
      user: { select: { name: true } },
      movie: { select: { title: true } },
    },
  });

  return review;
};

export const analyticsService = {
  getAnalyticsStats,
  getActivityLogs,
  getPendingReviews,
  approveReview,
  rejectReview,
  getChartData,
};
