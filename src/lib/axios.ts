import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith("/api")) {
    config.url = `/api${config.url}`;
  }
  return config;
});

export default axiosInstance;
