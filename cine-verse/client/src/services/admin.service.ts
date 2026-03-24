/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";

export const adminService = {
  getAnalyticsStats: async () => {
    const response = await axiosInstance.get("/admin-analytics/stats");
    return response.data;
  },

  getPendingReviews: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin-analytics/pending-reviews?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  approveReview: async (id: string) => {
    const response = await axiosInstance.patch(
      `/admin-analytics/pending-reviews/approve/${id}`
    );
    return response.data;
  },

  rejectReview: async (id: string) => {
    const response = await axiosInstance.patch(
      `/admin-analytics/pending-reviews/${id}/reject`
    );
    return response.data;
  },

  getActivityLogs: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(
      `/admin-analytics/activity-logs?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const response = await axiosInstance.put(`/admin/${userId}`, { status });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(`/admin/${userId}`);
    return response.data;
  },
};
