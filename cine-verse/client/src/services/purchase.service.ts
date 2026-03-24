import axiosInstance from "@/lib/axiosInstance";

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
    const res = await axiosInstance.get(`/purchase/check/${movieId}`);
    return res.data;
  },

  getPurchaseHistory: async () => {
    const res = await axiosInstance.get("/purchase/history");
    return res.data;
  },

  getAllPurchases: async () => {
    const res = await axiosInstance.get("/purchase/all");
    return res.data;
  },
};
