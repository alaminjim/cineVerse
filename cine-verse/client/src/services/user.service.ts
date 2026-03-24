/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

const noStoreConfig = {
  headers: {
    cache: "no-store",
  },
};

export const userService = {
  getUserDashboard: async () => {
    const response = await axiosInstance.get("/user", noStoreConfig);
    return response.data;
  },

  getUserProfile: async () => {
    const response = await axiosInstance.get("/user/profile", noStoreConfig);
    return response.data;
  },

  updateUserProfile: async (data: { name?: string; email?: string; image?: string }) => {
    const response = await axiosInstance.patch("/user/update-profile", data);
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get("/user/stats", noStoreConfig);
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/user/all?page=${page}&limit=${limit}`, noStoreConfig);
    return response.data;
  },
};
