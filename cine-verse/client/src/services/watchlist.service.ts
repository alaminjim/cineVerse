import axiosInstance from "@/lib/axiosInstance";

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
    const response = await axiosInstance.get("/watchList");
    return response.data;
  },

  checkWatchlist: async (movieId: string) => {
    const response = await axiosInstance.get(`/watchList/check/${movieId}`);
    return response.data;
  },
};
