/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const reviewService = {
  createReview: async (data: any) => {
    const response = await axiosInstance.post("/reviews", data);
    return response.data;
  },

  getReviewsByMovieId: async (movieId: string, page = 1, limit = 5) => {
    const response = await axiosInstance.get(
      `/reviews/movie/${movieId}?page=${page}&limit=${limit}`,
      noStoreConfig
    );
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await axiosInstance.delete(`/reviews/${id}`);
    return response.data;
  },

  updateReview: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/reviews/${id}`, data);
    return response.data;
  },

  getRecentApprovedReviews: async () => {
    const response = await axiosInstance.get("/reviews/recent-approved", noStoreConfig);
    return response.data;
  },

  approveReview: async (id: string) => {
    const response = await axiosInstance.put(`/reviews/approved/${id}`);
    return response.data;
  },

  rejectReview: async (id: string, reason?: string) => {
    const response = await axiosInstance.put(`/reviews/rejected/${id}`, { reason });
    return response.data;
  },
};
