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

  getAllMovies: async (params: any = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) query.append(key, String(params[key]));
    });
    
    const response = await axiosInstance.get(
      `/movies?${query.toString()}`,
      noStoreConfig,
    );
    return response.data;
  },

  getMovieById: async (id: string) => {
    const response = await axiosInstance.get(`/movies/${id}`, noStoreConfig);
    return response.data;
  },
};
