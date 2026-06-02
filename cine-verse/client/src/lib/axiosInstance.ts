import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

const publicPaths = [
  "/",
  "/movies",
  "/info",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/faq",
  "/series",
  "/trending",
  "/subscription",
  "/login",
  "/register",
  "/forgot-password",
];

const isPublicPage = (pathname: string) =>
  publicPaths.some((p) => pathname === p) ||
  pathname.startsWith("/movies/") ||
  pathname.startsWith("/login") ||
  pathname.startsWith("/register") ||
  pathname.startsWith("/forgot-password");

// Request interceptor — attach token only if it's a real value
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  // Guard: skip undefined/null/literal-string tokens
  if (token && token !== "undefined" && token !== "null" && token.length > 10) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Only redirect to login on protected pages
        if (!isPublicPage(currentPath)) {
          window.location.href = "/login";
        }
        // Silently swallow 401 on public pages — no redirect needed
        return Promise.resolve({ data: null, status: 401, silenced: true });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
