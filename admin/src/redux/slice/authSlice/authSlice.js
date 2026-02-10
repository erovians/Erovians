import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  permissions: null,
  error: null,
  message: null,
  success: false,

  // Admin specific
  adminType: null, // 'super-admin' | 'admin' | 'sub-admin'
  department: null,

  // 2FA Flow
  step: "login", // 'login' | '2fa'
  require2FA: false,
  sessionId: null,
  otpExpiresAt: null,

  // Remember me
  rememberMe: false,
};

// ========================================
// 1. ADMIN LOGIN
// ========================================
export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Login failed",
        }
      );
    }
  }
);

// ========================================
// 2. VERIFY 2FA
// ========================================
export const verify2FA = createAsyncThunk(
  "adminAuth/verify2FA",
  async ({ sessionId, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/verify-2fa", { sessionId, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Invalid OTP",
        }
      );
    }
  }
);

// ========================================
// 3. RESEND OTP
// ========================================
export const resendAdminOTP = createAsyncThunk(
  "adminAuth/resendOTP",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/resend-otp", { sessionId });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to resend OTP",
        }
      );
    }
  }
);

// ========================================
// 4. LOAD ADMIN USER
// ========================================
export const loadAdminUser = createAsyncThunk(
  "adminAuth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to load user",
        }
      );
    }
  }
);

// ========================================
// 5. LOAD ADMIN PERMISSIONS
// ========================================
export const loadAdminPermissions = createAsyncThunk(
  "adminAuth/loadPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/permissions");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to load permissions",
        }
      );
    }
  }
);

// ========================================
// 6. UPDATE ADMIN PROFILE
// ========================================
export const updateAdminProfile = createAsyncThunk(
  "adminAuth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/admin/update-profile", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to update profile",
        }
      );
    }
  }
);

// ========================================
// 7. CHANGE PASSWORD
// ========================================
export const changeAdminPassword = createAsyncThunk(
  "adminAuth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put("/admin/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to change password",
        }
      );
    }
  }
);

// ========================================
// 8. ENABLE/DISABLE 2FA
// ========================================
export const toggle2FA = createAsyncThunk(
  "adminAuth/toggle2FA",
  async ({ enable, secret }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/toggle-2fa", { enable, secret });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to toggle 2FA",
        }
      );
    }
  }
);

// ========================================
// 9. REFRESH TOKEN
// ========================================
export const refreshAdminToken = createAsyncThunk(
  "adminAuth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("adminRefreshToken");
      const response = await api.post("/admin/refresh-token", { refreshToken });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Session expired",
        }
      );
    }
  }
);

// ========================================
// 10. LOGOUT ADMIN
// ========================================
export const logoutAdmin = createAsyncThunk(
  "adminAuth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Logout failed",
        }
      );
    }
  }
);

// ========================================
// SLICE
// ========================================
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },

    // Clear success
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },

    // Set step (login/2fa)
    setStep: (state, action) => {
      state.step = action.payload;
    },

    // Reset auth flow
    resetAuthFlow: (state) => {
      state.step = "login";
      state.require2FA = false;
      state.sessionId = null;
      state.otpExpiresAt = null;
      state.error = null;
      state.message = null;
      state.success = false;
    },

    // Manual logout (clear tokens)
    clearAuth: (state) => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
      return { ...initialState };
    },
  },

  extraReducers: (builder) => {
    builder
      // ========================================
      // 1. ADMIN LOGIN
      // ========================================
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload?.message || "Login successful";

        // Check if user has admin role
        const userRoles = action.payload?.user?.role || [];
        const isAdmin = userRoles.some((role) =>
          ["super-admin", "admin", "sub-admin"].includes(role)
        );

        if (!isAdmin) {
          state.error = "Access denied. Admin privileges required.";
          state.success = false;
          state.loading = false;
          return;
        }

        // Check if 2FA is required
        if (action.payload?.require2FA) {
          state.require2FA = true;
          state.step = "2fa";
          state.sessionId = action.payload?.sessionId;
          state.otpExpiresAt = action.payload?.otpExpiresAt;
        } else {
          // Direct login
          state.isAuthenticated = true;
          state.user = action.payload?.user;
          state.adminType = action.payload?.user?.role?.find((r) =>
            ["super-admin", "admin", "sub-admin"].includes(r)
          );
          state.step = "login";

          // Store tokens
          if (action.payload?.token) {
            localStorage.setItem("adminToken", action.payload.token);
          }
          if (action.payload?.refreshToken) {
            localStorage.setItem(
              "adminRefreshToken",
              action.payload.refreshToken
            );
          }
          if (action.payload?.user) {
            localStorage.setItem(
              "adminUser",
              JSON.stringify(action.payload.user)
            );
          }
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Login failed";
        state.message = state.error;
      })

      // ========================================
      // 2. VERIFY 2FA
      // ========================================
      .addCase(verify2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload?.user;
        state.adminType = action.payload?.user?.role?.find((r) =>
          ["super-admin", "admin", "sub-admin"].includes(r)
        );
        state.require2FA = false;
        state.step = "login";
        state.sessionId = null;
        state.otpExpiresAt = null;
        state.message = action.payload?.message || "Verification successful";

        // Store tokens
        if (action.payload?.token) {
          localStorage.setItem("adminToken", action.payload.token);
        }
        if (action.payload?.refreshToken) {
          localStorage.setItem(
            "adminRefreshToken",
            action.payload.refreshToken
          );
        }
        if (action.payload?.user) {
          localStorage.setItem(
            "adminUser",
            JSON.stringify(action.payload.user)
          );
        }
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Invalid OTP";
        state.message = state.error;
      })

      // ========================================
      // 3. RESEND OTP
      // ========================================
      .addCase(resendAdminOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resendAdminOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.otpExpiresAt = action.payload?.otpExpiresAt;
        state.message = action.payload?.message || "OTP resent successfully";
      })
      .addCase(resendAdminOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to resend OTP";
        state.message = state.error;
      })

      // ========================================
      // 4. LOAD ADMIN USER
      // ========================================
      .addCase(loadAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data;
        state.adminType = action.payload?.data?.role?.find((r) =>
          ["super-admin", "admin", "sub-admin"].includes(r)
        );
      })
      .addCase(loadAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || "Failed to load user";
      })

      // ========================================
      // 5. LOAD ADMIN PERMISSIONS
      // ========================================
      .addCase(loadAdminPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAdminPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.permissions = action.payload?.data?.permissions;
        state.department = action.payload?.data?.department;
        state.adminType = action.payload?.data?.adminType;
      })
      .addCase(loadAdminPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load permissions";
      })

      // ========================================
      // 6. UPDATE ADMIN PROFILE
      // ========================================
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload?.data;
        state.message =
          action.payload?.message || "Profile updated successfully";

        // Update localStorage
        if (action.payload?.data) {
          localStorage.setItem(
            "adminUser",
            JSON.stringify(action.payload.data)
          );
        }
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to update profile";
        state.message = state.error;
      })

      // ========================================
      // 7. CHANGE PASSWORD
      // ========================================
      .addCase(changeAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changeAdminPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message =
          action.payload?.message || "Password changed successfully";
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to change password";
        state.message = state.error;
      })

      // ========================================
      // 8. TOGGLE 2FA
      // ========================================
      .addCase(toggle2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(toggle2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload?.message || "2FA settings updated";
      })
      .addCase(toggle2FA.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to update 2FA";
        state.message = state.error;
      })

      // ========================================
      // 9. REFRESH TOKEN
      // ========================================
      .addCase(refreshAdminToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAdminToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload?.token) {
          localStorage.setItem("adminToken", action.payload.token);
        }
      })
      .addCase(refreshAdminToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || "Session expired";

        // Clear all tokens
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminUser");
      })

      // ========================================
      // 10. LOGOUT ADMIN
      // ========================================
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminUser");

        return {
          ...initialState,
          message: action.payload?.message || "Logged out successfully",
          success: true,
          loading: false,
        };
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";

        // Force logout even if API fails
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminUser");

        return {
          ...initialState,
          error: state.error,
          message: state.error,
        };
      });
  },
});

export const { clearError, clearSuccess, setStep, resetAuthFlow, clearAuth } =
  adminAuthSlice.actions;

export default adminAuthSlice.reducer;
