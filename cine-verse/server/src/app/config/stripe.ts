import Stripe from "stripe";
import { envConfig } from "./env.js";

if (!envConfig.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);

export const STRIPE_PLANS = {
  MONTHLY: {
    priceId: envConfig.STRIPE_MONTHLY_PRICE_ID || "",
    name: "Monthly Subscription",
    interval: "month",
  },
  YEARLY: {
    priceId: envConfig.STRIPE_YEARLY_PRICE_ID || "",
    name: "Yearly Subscription",
    interval: "year",
  },
};

if (!STRIPE_PLANS.MONTHLY.priceId) {
  console.warn("Warning: STRIPE_MONTHLY_PRICE_ID is not configured");
}

if (!STRIPE_PLANS.YEARLY.priceId) {
  console.warn("Warning: STRIPE_YEARLY_PRICE_ID is not configured");
}
