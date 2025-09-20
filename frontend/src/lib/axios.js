import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : import.meta.env.MODE === "development" 
      ? "http://localhost:5001/api" 
      : "/api",
  withCredentials: true,
});

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);