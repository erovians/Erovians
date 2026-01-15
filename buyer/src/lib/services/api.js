import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
});

const PUBLIC_ROUTES = [
  "/auth/register",
  "/auth/login",
  "/auth/google-login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-otp",
  "/auth/resend-otp",
];

// ✅ Check if route is public (no token needed)
const isPublicRoute = (url) => {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

// ✅ Simple logic: PUBLIC routes = No Token | Other routes = Token needed

// ✅ Track if refresh is in progress
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

// ========================================
// REQUEST INTERCEPTOR
// ========================================
api.interceptors.request.use(
  (config) => {
    // ✅ FIXED: Add token for ALL non-public routes (simpler logic)
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

// ========================================
// RESPONSE INTERCEPTOR
// ========================================
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
        const response = await api.get("/auth/refresh-token");

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
