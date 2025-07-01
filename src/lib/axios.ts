import axios from "axios";
import { apiUrl } from "@/config/api";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.url) {
    config.url = apiUrl(config.url);
  }
  return config;
});

export default axiosInstance;
