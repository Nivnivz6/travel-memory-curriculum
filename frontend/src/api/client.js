import axios from "axios";

// Setup a base API client with default settings
export const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

// Helper to get auth headers for protected requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// POST /api/auth/register
export const registerApi = (data) => apiClient.post("/auth/register", data);

// POST /api/auth/login
export const loginApi = (data) => apiClient.post("/auth/login", data);

// GET /api/images
export const fetchImagesApi = (params = {}) => {
  return apiClient.get("/images", { params, headers: getAuthHeaders() });
};

// POST /api/images/upload
export const uploadImageApi = (formData) => {
  return apiClient.post("/images/upload", formData, { headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" } });
};

// DELETE /api/images
export const deleteImagesApi = (ids) => {
  return apiClient.delete("/images", { data: { ids }, headers: getAuthHeaders() });
};

// GET /api/analytics/images
export const imageAnalyticsApi = (params = {}) => {
  return apiClient.get("/analytics/images", { params, headers: getAuthHeaders() });
};

// GET /api/analytics/uploads
export const uploadAnalyticsApi = (params = {}) => {
  return apiClient.get("/analytics/uploads", { params, headers: getAuthHeaders() });
};
