import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8085", // base URL for your API
});

// Add a request interceptor to include the JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
