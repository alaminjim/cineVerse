import { envConfig } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { stripe, STRIPE_PLANS } from "../../config/stripe.js";
import { ICreateSubscription } from "./subcription.interface.js";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

const createSubscription = async (
  payload: ICreateSubscription,
  userId: string,
  userEmail: string,
) => {
  const existing = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE" as SubscriptionStatus,
    },
  });

  if (existing) {
    throw new Error("You already have an active subscription");
  }

  const plan = STRIPE_PLANS[payload.planType];

  if (!plan.priceId) {
    throw new Error(`Stripe price ID not configured for ${payload.planType}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${envConfig.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envConfig.FRONTEND_URL}/subscription/cancel`,
    customer_email: userEmail,
    metadata: {
      userId,
      planType: payload.planType,
    },
  });

  return {
    success: true,
    message: "Checkout session created",
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const confirmSubscription = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType as SubscriptionPlan;

  if (!userId || !planType) {
    throw new Error("Invalid session metadata");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const startDate = new Date();
  const endDate = new Date();

  if (planType === "MONTHLY") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (planType === "YEARLY") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  await prisma.subscription.updateMany({
    where: {
      userId,
      status: "ACTIVE" as SubscriptionStatus,
    },
    data: {
      status: "CANCELLED" as SubscriptionStatus,
    },
  });

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planType,
      status: "ACTIVE" as SubscriptionStatus,
      stripeId: session.subscription as string,
      startDate,
      endDate,
    },
  });

  return subscription;
};

const getActiveSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE" as SubscriptionStatus,
    },
  });

  if (!subscription) {
    return {
      success: true,
      isSubscribed: false,
      data: null,
      message: "No active subscription",
    };
  }
  if (subscription.endDate && new Date() > new Date(subscription.endDate)) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "EXPIRED" as SubscriptionStatus },
    });
    return {
      success: true,
      isSubscribed: false,
      data: null,
      message: "Subscription expired",
    };
  }

  return {
    success: true,
    isSubscribed: true,
    data: subscription,
  };
};

const cancelSubscription = async (subscriptionId: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  if (subscription.userId !== userId) {
    throw new Error("Unauthorized to cancel this subscription");
  }

  if (subscription.stripeId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeId);
    } catch (error) {
      console.error("Stripe cancellation error:", error);
    }
  }

  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "CANCELLED" as SubscriptionStatus,
      endDate: new Date(),
    },
  });

  return updated;
};

const getAllSubscriptions = async () => {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    data: subscriptions,
  };
};

export const subscriptionService = {
  createSubscription,
  confirmSubscription,
  getActiveSubscription,
  getAllSubscriptions,
  cancelSubscription,
};
