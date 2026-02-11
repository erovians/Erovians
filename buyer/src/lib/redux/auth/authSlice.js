import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  isAuthenticated: false,
  loading: false,
  profileLoading: false,
  buyerLoading: false,
  addressLoading: false,
  user: null,
  error: null,
  message: null,
  success: false,
  step: "initial",
  isNewUser: null,
  identifier: "",
  loginMethod: "mobile",
  authMode: "login", // "login" or "signup"
  loginType: null, // "otp" or "password" (only for login mode)
  hasPassword: false, // to check if user can login with password
  otpSent: false,
  otpPurpose: null,
  otpExpiresAt: null,
  requiresVerification: false,
  nextRoute: null,
};

// ========================================
// 1. LOAD USER
// ========================================
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
          message: "Failed to load user",
        }
      );
    }
  }
);

// ========================================
// 2. CHECK USER & SEND OTP
// ========================================
export const checkUserAndSendOTP = createAsyncThunk(
  "auth/checkUserAndSendOTP",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(formData);
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
// 3. VERIFY OTP
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
// 4. COMPLETE REGISTRATION (Name Submit)
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
// 5. LOGIN WITH PASSWORD
// ========================================
export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login-password", formData);
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
// 6. RESEND OTP
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
// 7. LOGOUT
// ========================================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
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
// 8. UPDATE USER
// ========================================
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/update-user", formData);
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

// ========================================
// 9. UPDATE ADDRESS (Billing/Shipping)
// ========================================
export const updateAddress = createAsyncThunk(
  "auth/updateAddress",
  async ({ type, action, data, index }, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/update-address", {
        type,
        action,
        data,
        index,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to update address",
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
    setAuthMode: (state, action) => {
      state.authMode = action.payload;
      state.step = "initial";
      state.loginType = null;
      state.hasPassword = false;
      state.identifier = "";
      state.error = null;
      state.message = null;
    },
    setLoginType: (state, action) => {
      state.loginType = action.payload;
    },
    resetAuthFlow: (state) => {
      state.step = "initial";
      state.isNewUser = null;
      state.identifier = "";
      state.loginType = null;
      state.hasPassword = false;
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
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder

      // ========================================
      // 1. LOAD USER
      // ========================================
      .addCase(loadUser.pending, (state) => {
        state.loading = true; // General loading for page load
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
        state.message = state.error;
      })

      // ========================================
      // 2. CHECK USER & SEND OTP
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
        state.isNewUser = action.payload?.isNewUser || false;
        state.identifier = action.payload?.identifier || state.identifier;
        state.otpPurpose = action.payload?.otpPurpose || "login";
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
        state.requiresVerification = true;
        state.hasPassword = action.payload?.hasPassword || false;
        state.message = action.payload?.message || "OTP sent successfully";

        if (state.authMode === "signup") {
          state.step = "otp";
        } else if (state.authMode === "login" && state.hasPassword) {
          state.step = "loginChoice";
        } else {
          state.step = "otp";
        }
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

        if (action.payload?.isNewUser) {
          state.step = "name";
          state.requiresVerification = false;
        } else {
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
      // 4. COMPLETE REGISTRATION
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
      // 5. LOGIN WITH PASSWORD
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
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.step = "initial";
        state.nextRoute = action.payload?.nextRoute || "/";
        state.message = action.payload?.message || "Login successful";

        if (action.payload?.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message || action.payload?.error || "Login failed";
        state.message = state.error;
      })

      // ========================================
      // 6. RESEND OTP
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
      })

      // ========================================
      // 7. LOGOUT
      // ========================================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

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
        state.message = state.error;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return { ...initialState, error: state.error };
      })

      // ========================================
      // 8. UPDATE USER - SPLIT INTO PROFILE & BUYER
      // ========================================
      .addCase(updateUser.pending, (state, action) => {
        // Check if it's profile update or buyer update based on payload
        const payload = action.meta.arg;

        if (payload.buyer_data) {
          state.buyerLoading = true; // Buyer details loading
        } else {
          state.profileLoading = true; // Personal info loading
        }

        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.buyerLoading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message = action.payload?.message || "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.profileLoading = false;
        state.buyerLoading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update user";
        state.message = state.error;
      })

      // ========================================
      // 9. UPDATE ADDRESS
      // ========================================
      .addCase(updateAddress.pending, (state) => {
        state.addressLoading = true; // Address specific loading
        state.error = null;
        state.success = false;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message =
          action.payload?.message || "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update address";
        state.message = state.error;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setLoginMethod,
  setAuthMode,
  setLoginType,
  resetAuthFlow,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
