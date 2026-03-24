import axiosInstance from "@/lib/axiosInstance";

export const likeService = {
  likeReview: async (reviewId: string) => {
    const response = await axiosInstance.post(`/likes/${reviewId}`);
    return response.data;
  },

  unlikeReview: async (reviewId: string) => {
    const response = await axiosInstance.delete(`/likes/${reviewId}`);
    return response.data;
  },

  checkLike: async (reviewId: string) => {
    const response = await axiosInstance.get(`/likes/check/${reviewId}`);
    return response.data;
  },
};
