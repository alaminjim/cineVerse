/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

export const authService = {
  login: async (credentials: any) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async (userData: any) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  },
};
