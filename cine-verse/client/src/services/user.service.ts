/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

export const userService = {
  getUserDashboard: async () => {
    const response = await axiosInstance.get("/user");
    return response.data;
  },

  getUserProfile: async () => {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  },

  updateUserProfile: async (data: { name?: string; email?: string; image?: string }) => {
    const response = await axiosInstance.patch("/user/update-profile", data);
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get("/user/stats");
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/user/all?page=${page}&limit=${limit}`);
    return response.data;
  },
};
