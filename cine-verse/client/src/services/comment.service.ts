/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

export const commentService = {
  createComment: async (data: { reviewId: string; content: string; parentCommentId?: string }) => {
    const response = await axiosInstance.post("/comments", data);
    return response.data;
  },

  getCommentsByReview: async (reviewId: string) => {
    const response = await axiosInstance.get(`/comments/review/${reviewId}`);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data;
  },
};
