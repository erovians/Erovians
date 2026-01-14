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

    // ✅ Skip token refresh logic for public routes
    if (isPublicRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    // ✅ Handle 401 (Token Expired) for protected routes only
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access Token Expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // ✅ If refresh is already happening, queue this request
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

          // ✅ Update all queued requests
          processQueue(null, newToken);

          // ✅ Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // ✅ Refresh failed - clear everything and redirect
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // ✅ Redirect to login only if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ For other errors (403, 404, 500, etc.), just reject
    return Promise.reject(error);
  }
);

export default api;
