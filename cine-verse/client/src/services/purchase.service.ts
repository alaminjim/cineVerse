import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const purchaseService = {
  createCheckout: async (movieId: string, purchaseType: "BUY" | "RENT") => {
    const res = await axiosInstance.post("/purchase", {
      movieId,
      purchaseType,
    });
    return res.data;
  },

  confirmPurchase: async (sessionId: string) => {
    const res = await axiosInstance.post("/purchase/confirm", { sessionId });
    return res.data;
  },

  checkPurchase: async (movieId: string) => {
    const res = await axiosInstance.get(`/purchase/check/${movieId}`, noStoreConfig);
    return res.data;
  },

  getPurchaseHistory: async () => {
    const res = await axiosInstance.get("/purchase/history", noStoreConfig);
    return res.data;
  },

  getAllPurchases: async () => {
    const res = await axiosInstance.get("/purchase/all", noStoreConfig);
    return res.data;
  },
};
