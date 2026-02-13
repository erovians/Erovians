import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  message: null,
  success: false,
  
  // Login flow specific
  userId: null,
  otpExpiresAt: null,
  requiresVerification: false,
};

// ========================================
// 1. LOAD USER
// ========================================
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/auth/me");
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
// 2. LOGIN WITH PASSWORD
// ========================================
export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/auth/login", {
        identifier,
        password,
      });
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
// 3. VERIFY OTP - FIX
// ========================================
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/auth/verify-otp", {  // ✅ ADD "auth"
        userId,
        otp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "OTP verification failed",
        }
      );
    }
  }
);

// ========================================
// 4. RESEND OTP - FIX
// ========================================
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/auth/resend-otp", {  // ✅ ADD "auth"
        userId,
      });
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
// 5. LOGOUT - FIX
// ========================================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/auth/logout");  // ✅ ADD "auth"
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to logout",
        }
      );
    }
  }
);

// ========================================
// 6. UPDATE USER - FIX (agar yeh route hai backend me)
// ========================================
export const updateAdmin = createAsyncThunk(
  "auth/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/admin/auth/update-user", formData);  // ✅ ADD "auth"
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to update User",
        }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    resetAuthFlow: (state) => {
      state.userId = null;
      state.otpExpiresAt = null;
      state.requiresVerification = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("otpExpiresAt");
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder

      // ========================================
      // 1. LOAD USER
      // ========================================
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to load user";
      })

      // ========================================
      // 2. LOGIN WITH PASSWORD
      // ========================================
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload?.message || "OTP sent successfully";
        
        // Store userId and OTP expiry
        state.userId = action.payload?.userId || null;
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
        state.requiresVerification = true;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message || action.payload?.error || "Login failed";
      })

      // ========================================
      // 3. VERIFY OTP
      // ========================================
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload?.message || "OTP verified successfully";
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        
        // Clear OTP flow data
        state.userId = null;
        state.otpExpiresAt = null;
        state.requiresVerification = false;

        // Store access token
        if (action.payload?.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "OTP verification failed";
      })

      // ========================================
      // 4. RESEND OTP
      // ========================================
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
        state.message = action.payload?.message || "OTP resent successfully";
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to resend OTP";
      })

      // ========================================
      // 5. LOGOUT
      // ========================================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("otpExpiresAt");
        return {
          ...initialState,
          message: action.payload?.message || "Logged out successfully",
          success: true,
          loading: false,
        };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to logout";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("otpExpiresAt");
        return { ...initialState, error: state.error };
      })

      // ========================================
      // 6. UPDATE USER
      // ========================================
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message = action.payload?.message || "User updated successfully";
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update user";
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetAuthFlow,
  logout,
} = authSlice.actions;

export default authSlice.reducer;