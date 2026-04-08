import axiosInstance from "@/lib/axiosInstance";

export const blogService = {
  getAllBlogs: async () => {
    const response = await axiosInstance.get("/blog");
    return response.data;
  },

  getBlogById: async (id: string) => {
    const response = await axiosInstance.get(`/blog/${id}`);
    return response.data;
  },

  createBlog: async (data: any) => {
    const response = await axiosInstance.post("/blog", data);
    return response.data;
  },

  updateBlog: async (id: string, data: any) => {
    const response = await axiosInstance.patch(`/blog/${id}`, data);
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await axiosInstance.delete(`/blog/${id}`);
    return response.data;
  },
};
