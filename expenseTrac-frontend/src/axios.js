import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-trac-backend.onrender.com/api/user", // your backend
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("token");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
