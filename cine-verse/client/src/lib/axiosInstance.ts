import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
