/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma";

const getUserDashboard = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const totalReviews = await prisma.review.count({
    where: { userId },
  });

  const totalPurchases = await prisma.purchase.count({
    where: { userId },
  });

  const activeRentals = await prisma.purchase.count({
    where: {
      userId,
      purchaseType: "RENT",
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
  });

  const totalBought = await prisma.purchase.count({
    where: {
      userId,
      purchaseType: "BUY",
      status: "ACTIVE",
    },
  });

  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      planType: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });

  const watchlistCount = await prisma.watchlist.count({
    where: { userId },
  });

  const recentReviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      movie: { select: { id: true, title: true, thumbnail: true } },
    },
  });

  const recentPurchases = await prisma.purchase.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      movie: { select: { id: true, title: true, thumbnail: true } },
    },
  });

  const watchlistItems = await prisma.watchlist.findMany({
    where: { userId },
    take: 5,
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          avgRating: true,
        },
      },
    },
  });

  const purchaseSummary = await prisma.purchase.aggregate({
    where: { userId, status: "ACTIVE" },
    _count: { id: true },
    _sum: { amount: true },
  });

  return {
    success: true,
    data: {
      user,
      stats: {
        totalReviews,
        totalPurchases,
        activeRentals,
        totalBought,
        watchlistCount,
        totalSpent: purchaseSummary._sum.amount || 0,
      },
      subscription: activeSubscription,
      recentReviews,
      recentPurchases,
      watchlistItems,
    },
  };
};

const getUserStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const reviewsStats = await prisma.review.aggregate({
    where: { userId },
    _count: { id: true },
    _avg: { rating: true },
  });

  const purchasesStats = await prisma.purchase.aggregate({
    where: { userId, status: "ACTIVE" },
    _count: { id: true },
    _sum: { amount: true },
  });

  const favoriteGenres = await prisma.review.findMany({
    where: { userId },
    include: {
      movie: {
        select: { genre: true },
      },
    },
    take: 100,
  });

  const genreCount: { [key: string]: number } = {};
  favoriteGenres.forEach((review: any) => {
    review.movie.genre.forEach((g: any) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  return {
    success: true,
    data: {
      user,
      reviews: {
        total: reviewsStats._count.id,
        averageRating: reviewsStats._avg.rating || 0,
      },
      purchases: {
        total: purchasesStats._count.id,
        totalSpent: purchasesStats._sum.amount || 0,
      },
      topGenres,
    },
  };
};

const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    data: user,
  };
};

const updateUserProfile = async (userId: string, payload: any) => {
  const updateData: any = {};

  if (payload.name) {
    updateData.name = String(payload.name).trim();
  }

  if (payload.email) {
    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existing && existing.id !== userId) {
      throw new Error("Email already in use");
    }

    updateData.email = String(payload.email).toLowerCase().trim();
  }

  if (payload.image) {
    updateData.image = String(payload.image);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  return {
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  };
};

const getAllUsers = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count();

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: users,
  };
};

export const userService = {
  getUserDashboard,
  getUserStats,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
