import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://cine-verse-server-pi.vercel.app/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const publicPaths = ["/", "/movies", "/info", "/about", "/contact", "/privacy", "/terms", "/faq", "/series", "/trending", "/subscription"];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      
      // Only redirect to login if on a protected route
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isPublicPage =
          publicPaths.some((path) => currentPath === path) ||
          currentPath.startsWith("/movies/") ||
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/register");
        
        if (!isPublicPage) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

