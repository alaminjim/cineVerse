import { prisma } from "../../lib/prisma.js";
import { stripe } from "../../config/stripe.js";
import { envConfig } from "../../config/env.js";
import { ICreatePurchase } from "./purchase.interface.js";
import { PurchaseStatus, PurchaseType } from "../../../generated/prisma/enums.js";

const createPurchaseCheckout = async (
  payload: ICreatePurchase,
  userId: string,
  userEmail: string,
) => {
  const movie = await prisma.movie.findUnique({
    where: { id: payload.movieId },
  });

  if (!movie) {
    return null;
  }

  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      movieId: payload.movieId,
      purchaseType: payload.purchaseType as PurchaseType,
      isPurchase: true,
      status: "ACTIVE",
    },
  });

  if (existingPurchase) {
    throw new Error(`You already have an active ${payload.purchaseType} for this movie`);
  }

  const amount =
    payload.purchaseType === "BUY" ? movie.buyPrice : movie.rentPrice;

  if (!amount || amount <= 0) {
    throw new Error(`Price not set for this movie`);
  }

  const movieImages = movie.thumbnail ? [movie.thumbnail] : [];
  const unitAmount = Math.round(amount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `${movie.title} (${payload.purchaseType})`,
            images: movieImages,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${envConfig.FRONTEND_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envConfig.FRONTEND_URL}/purchase/cancel`,
    customer_email: userEmail,
    metadata: {
      userId,
      movieId: payload.movieId,
      purchaseType: payload.purchaseType,
    },
  });

  return {
    success: true,
    message: "Checkout session created",
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const confirmPurchase = async (sessionId: string) => {

  const existing = await prisma.purchase.findFirst({
    where: { stripeTransactionId: sessionId },
  });

  if (existing) {
    return {
      success: true,
      message: "Purchase already confirmed",
      data: existing,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed yet.");
  }

  const userId = session.metadata?.userId;
  const movieId = session.metadata?.movieId;
  const purchaseType = session.metadata?.purchaseType as PurchaseType;

  if (!userId || !movieId || !purchaseType) {
    throw new Error("Invalid session metadata. Cannot complete purchase.");
  }

  const expiresAt =
    purchaseType === "RENT"
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : null;

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      movieId,
      purchaseType,
      isPurchase: true,
      status: "ACTIVE",
      amount: session.amount_total ? session.amount_total / 100 : 0,
      stripeTransactionId: session.id,
      expiresAt,
    },
  });

  return {
    success: true,
    message: `Payment successful! Movie ${purchaseType === "BUY" ? "purchased" : "rented"}.`,
    data: purchase,
  };
};

const getPurchaseHistory = async (userId: string) => {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          genre: true,
          streamingLink: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    data: purchases,
  };
};

const checkPurchase = async (movieId: string, userId: string, role: string) => {
  if (role === "ADMIN") {
    return {
      success: true,
      isPurchased: true,
      purchaseType: "ADMIN_ACCESS",
    };
  }

  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
  });

  if (activeSubscription) {

    if (activeSubscription.endDate && new Date() > new Date(activeSubscription.endDate)) {
      await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: { status: "EXPIRED" },
      });
    } else {

      return {
        success: true,
        isPurchased: true,
        purchaseType: "SUBSCRIPTION",
        subscriptionPlan: activeSubscription.planType,
      };
    }
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      movieId,
      isPurchase: true,
      status: "ACTIVE",
    },
  });

  if (purchase) {

    if (purchase.purchaseType === "RENT" && purchase.expiresAt) {
      if (new Date() > new Date(purchase.expiresAt)) {
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { status: "EXPIRED" as PurchaseStatus },
        });
        return { success: true, isPurchased: false, purchaseType: null };
      }
    }
    return {
      success: true,
      isPurchased: true,
      purchaseType: purchase.purchaseType,
    };
  }

  return { success: true, isPurchased: false, purchaseType: null };
};

const cancelRental = async (purchaseId: string, userId: string) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  if (purchase.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (purchase.purchaseType !== "RENT") {
    throw new Error("Cannot cancel purchase");
  }

  const updated = await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: "CANCELLED" as PurchaseStatus,
      expiresAt: new Date(),
    },
  });

  return {
    success: true,
    message: "Rental cancelled",
    data: updated,
  };
};

const getAllPurchases = async () => {
  const purchases = await prisma.purchase.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
  });

  return {
    success: true,
    data: purchases,
  };
};

export const purchaseService = {
  createPurchaseCheckout,
  confirmPurchase,
  getPurchaseHistory,
  getAllPurchases,
  checkPurchase,
  cancelRental,
};
