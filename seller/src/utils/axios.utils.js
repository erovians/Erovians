import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ✅ Chat API - simple export (no interceptor)
const chatApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL_CHAT,
  withCredentials: true,
});

const PUBLIC_ROUTES = [
  "/seller/send-otp",
  "/seller/verify-otp",
  "/seller/login",
  "/seller/register",
  "/seller/forgot-password",
  "/seller/reset-password",
];

const isPublicRoute = (url) => {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    if (!isPublicRoute(config.url)) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    config.headers["x-platform"] = "web";
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isPublicRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access Token Expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.get("/v2/auth/refresh-token");

        if (response.data.accessToken) {
          const newToken = response.data.accessToken;
          localStorage.setItem("accessToken", newToken);

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { chatApi };
