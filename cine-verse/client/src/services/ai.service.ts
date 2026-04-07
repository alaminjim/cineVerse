import axiosInstance from "@/lib/axiosInstance";

export const aiService = {
  getMovieRecommendations: async (prompt: string) => {
    const response = await axiosInstance.post(`/ai/recommendations`, {
      prompt,
    });
    return response.data;
  },
};
