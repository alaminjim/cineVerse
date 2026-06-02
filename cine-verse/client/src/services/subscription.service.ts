import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const subscriptionService = {
  createSubscription: async (planType: "MONTHLY" | "YEARLY" | "FAMILY" | "FREE") => {
    const res = await axiosInstance.post("/subscription", { planType });
    return res.data;
  },

  confirmSubscription: async (sessionId: string) => {
    const res = await axiosInstance.post("/subscription/confirm", {
      sessionId,
    });
    return res.data;
  },

  getActiveSubscription: async () => {
    const res = await axiosInstance.get("/subscription/active", noStoreConfig);
    return res.data;
  },

  cancelSubscription: async (subscriptionId: string) => {
    const res = await axiosInstance.post(`/subscription/${subscriptionId}`);
    return res.data;
  },

  getAllSubscriptions: async () => {
    const res = await axiosInstance.get("/subscription/all", noStoreConfig);
    return res.data;
  },
};
