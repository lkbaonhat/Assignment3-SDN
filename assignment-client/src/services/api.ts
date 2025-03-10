import axios from "axios";

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Metadata for API requests including timestamp and user info
export const API_METADATA = {
  timestamp: "2025-03-10 05:07:28",
  user: "lkbaonhatcontinue",
};

export default api;
