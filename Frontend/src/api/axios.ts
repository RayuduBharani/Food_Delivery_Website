import axios from "axios";

/**
 * Centralized Axios instance for all API calls.
 *
 * Benefits:
 * - Single place to configure base URL, timeouts, and headers
 * - Request interceptor auto-attaches JWT token from localStorage
 * - Response interceptor provides consistent error handling
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://food-delivery-website-seven-theta.vercel.app/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────
// Automatically attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────
// Unwrap successful responses and handle common error patterns
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returned a structured error, pass it through
    if (error.response?.data?.message) {
      return Promise.reject(error);
    }
    // Network errors or timeouts
    return Promise.reject(error);
  }
);

export default api;
