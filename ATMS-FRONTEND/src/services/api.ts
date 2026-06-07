import axios from "axios";

// Configure backend base URL via env or fall back to localhost:8080
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8082";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Normalize error messages
    const msg =
      err?.response?.data?.body ||
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Network error";
    return Promise.reject(new Error(msg));
  }
);

export default api;
