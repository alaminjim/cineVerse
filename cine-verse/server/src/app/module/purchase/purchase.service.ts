import { prisma } from "../../lib/prisma";
import { stripe } from "../../config/stripe";
import { envConfig } from "../../config/env";
import { ICreatePurchase } from "./purchase.interface";
import { PurchaseStatus, PurchaseType } from "../../../generated/prisma/enums";

const createPurchaseCheckout = async (
  payload: ICreatePurchase,
  userId: string,
  userEmail: string,
) => {
  const movie = await prisma.movie.findUnique({
    where: { id: payload.movieId },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  if (payload.purchaseType === "BUY") {
    const existing = await prisma.purchase.findFirst({
      where: {
        userId,
        movieId: payload.movieId,
        purchaseType: "BUY",
      },
    });

    if (existing) {
      throw new Error("You already own this movie");
    }
  }

  if (payload.purchaseType === "RENT") {
    const existing = await prisma.purchase.findFirst({
      where: {
        userId,
        movieId: payload.movieId,
        purchaseType: "RENT",
        status: "ACTIVE" as PurchaseStatus,
        expiresAt: { gt: new Date() },
      },
    });

    if (existing) {
      throw new Error("You already have active rental");
    }
  }

  const priceId =
    payload.purchaseType === "BUY"
      ? movie.stripeBuyPriceId
      : movie.stripeRentPriceId;

  if (!priceId) {
    throw new Error(`Stripe price not configured for ${payload.purchaseType}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
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
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const userId = session.metadata?.userId;
  const movieId = session.metadata?.movieId;
  const purchaseType = session.metadata?.purchaseType as PurchaseType;

  if (!userId || !movieId || !purchaseType) {
    throw new Error("Invalid session metadata");
  }

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new Error("Movie not found");
  }

  const expiresAt =
    purchaseType === "RENT"
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : null;

  let amount = 0;

  if (purchaseType === "BUY" && movie.stripeBuyPriceId) {
    const priceDetails = await stripe.prices.retrieve(movie.stripeBuyPriceId);
    amount = priceDetails.unit_amount || 0;
  } else if (purchaseType === "RENT" && movie.stripeRentPriceId) {
    const priceDetails = await stripe.prices.retrieve(movie.stripeRentPriceId);
    amount = priceDetails.unit_amount || 0;
  }

  if (amount <= 0) {
    throw new Error("Invalid price amount");
  }

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      movieId,
      purchaseType,
      status: "ACTIVE",
      amount,
      stripeTransactionId: session.id,
      expiresAt,
    },
  });

  return {
    success: true,
    message: `Movie ${purchaseType === "BUY" ? "purchased" : "rented for 7 days"}`,
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

const checkPurchase = async (movieId: string, userId: string) => {
  const buy = await prisma.purchase.findFirst({
    where: {
      userId,
      movieId,
      purchaseType: "BUY",
    },
  });

  if (buy) {
    return {
      success: true,
      isPurchased: true,
      purchaseType: "BUY",
      expiresAt: null,
      status: "ACTIVE",
    };
  }

  const rent = await prisma.purchase.findFirst({
    where: {
      userId,
      movieId,
      purchaseType: "RENT",
      status: "ACTIVE" as PurchaseStatus,
      expiresAt: { gt: new Date() },
    },
  });

  if (rent) {
    const daysRemaining = Math.ceil(
      (rent.expiresAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    return {
      success: true,
      isPurchased: true,
      purchaseType: "RENT",
      expiresAt: rent.expiresAt,
      daysRemaining,
      status: "ACTIVE",
    };
  }

  return {
    success: true,
    isPurchased: false,
  };
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

export const purchaseService = {
  createPurchaseCheckout,
  confirmPurchase,
  getPurchaseHistory,
  checkPurchase,
  cancelRental,
};
