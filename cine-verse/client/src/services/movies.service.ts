/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

// Cache configuration for better performance
const cacheConfig = {
  headers: {
    cache: "force-cache",
  },
  next: {
    revalidate: 300, // 5 minutes
  },
};

export const pingServer = async (): Promise<void> => {
  try {
    await axiosInstance.get("/ping", { timeout: 5000 });
  } catch {
    // Ignore — this is just a warm-up call
  }
};

export const moviesService = {
  getFeatured: async () => {
    const response = await axiosInstance.get("/movies/featured", cacheConfig);
    return response.data;
  },

  getNewReleases: async () => {
    const response = await axiosInstance.get(
      "/movies/new-releases",
      cacheConfig,
    );
    return response.data;
  },

  getComingSoon: async () => {
    const response = await axiosInstance.get(
      "/movies/coming-soon",
      cacheConfig,
    );
    return response.data;
  },

  getEditorsPicks: async () => {
    const response = await axiosInstance.get(
      "/movies/editors-picks",
      cacheConfig,
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
      cacheConfig,
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
