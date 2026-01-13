import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  // Auth Status
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  message: null,
  success: false,

  // Flow Control
  step: "initial", // 'initial' | 'otp' | 'name'
  isNewUser: null, // null | true | false
  identifier: "", // mobile/email jo submit kiya
  loginMethod: "mobile", // 'mobile' | 'email'

  // OTP Management
  otpSent: false,
  otpPurpose: null, // 'login' | 'register' | 'forgot_password' | 'device_verification'
  otpExpiresAt: null,
  requiresVerification: false,

  // Navigation
  nextRoute: null, // '/profile' | '/reset-password' | '/verify-otp' etc
};

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to send OTP",
        }
      );
    }
  }
);

// ========================================
// 1. CHECK USER & SEND OTP
// ========================================
export const checkUserAndSendOTP = createAsyncThunk(
  "auth/checkUserAndSendOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/check-user", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to send OTP",
        }
      );
    }
  }
);

// ========================================
// 2. VERIFY OTP
// ========================================
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", formData);
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
// 3. COMPLETE REGISTRATION (Name Submit)
// ========================================
export const completeRegistration = createAsyncThunk(
  "auth/completeRegistration",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/complete-registration", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Registration failed",
        }
      );
    }
  }
);

// ========================================
// 4. RESEND OTP
// ========================================
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/resend-otp", formData);
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
// 4. LOGOUT HAI BHAII
// ========================================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/logout");
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    setLoginMethod: (state, action) => {
      state.loginMethod = action.payload;
      state.identifier = "";
    },
    resetAuthFlow: (state) => {
      state.step = "initial";
      state.isNewUser = null;
      state.identifier = "";
      state.otpSent = false;
      state.otpPurpose = null;
      state.otpExpiresAt = null;
      state.requiresVerification = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder

      // ========================================
      // CHECK USER & SEND OTP
      // ========================================
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.message = action.payload?.message || "";
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to get User";
        state.message = state.error;
      })

      // ========================================
      // CHECK USER & SEND OTP
      // ========================================
      .addCase(checkUserAndSendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(checkUserAndSendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.otpSent = true;
        state.step = "otp";
        state.isNewUser = action.payload?.isNewUser || false;
        state.identifier = action.payload?.identifier || state.identifier;
        state.otpPurpose = action.payload?.otpPurpose || "login";
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
        state.requiresVerification = true;
        state.message = action.payload?.message || "OTP sent successfully";
      })
      .addCase(checkUserAndSendOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.otpSent = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to send OTP";
        state.message = state.error;
      })

      // ========================================
      // VERIFY OTP
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

        // Check if new user (needs name)
        if (action.payload?.isNewUser) {
          state.step = "name";
          state.requiresVerification = false;
        } else {
          // Existing user - Login complete
          state.isAuthenticated = true;
          state.user = action.payload?.data || null;
          state.step = "initial";
          state.requiresVerification = false;
          state.otpPurpose = null;
          state.otpExpiresAt = null;
          state.nextRoute = action.payload?.nextRoute || "/";

          if (action.payload?.accessToken) {
            localStorage.setItem("accessToken", action.payload.accessToken);
          }
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "OTP verification failed";
        state.message = state.error;
      })

      // ========================================
      // COMPLETE REGISTRATION
      // ========================================
      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.step = "initial";
        state.isNewUser = false;
        state.requiresVerification = false;
        state.otpPurpose = null;
        state.otpExpiresAt = null;
        state.nextRoute = action.payload?.nextRoute || "/";
        state.message =
          action.payload?.message || "Registration completed successfully";

        if (action.payload?.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Registration failed";
        state.message = state.error;
      })

      // ========================================
      // RESEND OTP
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
        state.message = state.error;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setLoginMethod,
  resetAuthFlow,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
