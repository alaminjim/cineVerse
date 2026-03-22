/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const moviesService = {
  getFeatured: async () => {
    const response = await axiosInstance.get("/movies/featured", noStoreConfig);
    return response.data;
  },

  getNewReleases: async () => {
    const response = await axiosInstance.get(
      "/movies/new-releases",
      noStoreConfig,
    );
    return response.data;
  },

  getAllMovies: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/movies?page=${page}&limit=${limit}`,
      noStoreConfig,
    );
    return response.data;
  },
};
