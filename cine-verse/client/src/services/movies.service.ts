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

  getComingSoon: async () => {
    const response = await axiosInstance.get(
      "/movies/coming-soon",
      noStoreConfig,
    );
    return response.data;
  },

  getEditorsPicks: async () => {
    const response = await axiosInstance.get(
      "/movies/editors-picks",
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

  deleteMovie: async (id: string) => {
    const response = await axiosInstance.delete(`/movies/${id}`);
    return response.data;
  },

  createMovie: async (data: FormData) => {
    const response = await axiosInstance.post(`/movies`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateMovie: async (id: string, data: FormData) => {
    const response = await axiosInstance.put(`/movies/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
