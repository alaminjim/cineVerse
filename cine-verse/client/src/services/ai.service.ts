import axiosInstance from "@/lib/axiosInstance";

export const aiService = {
  // CineBuddy conversational chat
  chatWithBot: async (message: string, history: { role: string; content: string }[]) => {
    const response = await axiosInstance.post(`/ai/chat`, {
      message,
      history,
    });
    return response.data;
  },

  // Search suggestions
  getSearchSuggestions: async (query: string) => {
    const response = await axiosInstance.get(
      `/ai/search-suggestions?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Movie recommendations
  getMovieRecommendations: async (prompt: string) => {
    const response = await axiosInstance.post(`/ai/recommendations`, {
      prompt,
    });
    return response.data;
  },
};
