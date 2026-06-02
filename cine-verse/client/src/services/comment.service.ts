/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const commentService = {
  createComment: async (data: { reviewId: string; content: string; parentCommentId?: string }) => {
    const response = await axiosInstance.post("/comments", data);
    return response.data;
  },

  getCommentsByReview: async (reviewId: string) => {
    const response = await axiosInstance.get(`/comments/review/${reviewId}`, noStoreConfig);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data;
  },
};
