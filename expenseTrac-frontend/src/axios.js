import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/", // your backend
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
