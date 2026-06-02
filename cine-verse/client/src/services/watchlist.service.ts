import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const watchlistService = {
  addToWatchlist: async (movieId: string) => {
    const response = await axiosInstance.post(`/watchList/${movieId}`);
    return response.data;
  },

  removeFromWatchlist: async (movieId: string) => {
    const response = await axiosInstance.delete(`/watchList/${movieId}`);
    return response.data;
  },

  getWatchlist: async () => {
    const response = await axiosInstance.get("/watchList", noStoreConfig);
    return response.data;
  },

  checkWatchlist: async (movieId: string) => {
    const response = await axiosInstance.get(`/watchList/check/${movieId}`, noStoreConfig);
    return response.data;
  },
};
