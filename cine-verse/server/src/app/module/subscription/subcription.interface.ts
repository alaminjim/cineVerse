import {
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../../generated/prisma/enums";

export interface ICreateSubscription {
  planType: SubscriptionPlan;
}

export interface ISubscriptionResponse {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeId?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
