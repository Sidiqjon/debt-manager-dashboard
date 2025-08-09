import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token_seller");
        
        if (refreshToken) {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/sellers/refresh`, {
            refreshToken
          });

          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        Cookies.remove("token");
        Cookies.remove("refresh_token_seller");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);