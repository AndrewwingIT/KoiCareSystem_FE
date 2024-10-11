// src/configs/axiosConfig.js
import axios from "axios";
import { API_ENDPOINTS } from "@/configs/apiConfig";
// Lấy API_BASE_URL từ file apiConfig.js
import { API_BASE_URL } from "./apiConfig";

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Địa chỉ API cơ bản
  timeout: 5000, // Thời gian timeout của request
});

// Thêm token vào header nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
