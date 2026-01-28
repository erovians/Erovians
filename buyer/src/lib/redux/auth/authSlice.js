import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  message: null,
  success: false,
  step: "initial",
  isNewUser: null,
  identifier: "",
  loginMethod: "mobile",
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
// 5. RESEND OTP
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
// 6. LOGOUT
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
// 7. UPDATE USER
// ========================================
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (formData, { rejectWithValue }) => {
    console.log("this is update user formdata", formData);
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
// 8. UPDATE ADDRESS (Billing/Shipping)
// ========================================
export const updateAddress = createAsyncThunk(
  "auth/updateAddress",
  async ({ type, action, data, index }, { rejectWithValue }) => {
    console.log("this is type", type);
    console.log("this is action", action);
    console.log("this is user data", data);
    console.log("this is index", index);
    try {
      const response = await api.put("/auth/update-address", {
        type, // 'billing' or 'shipping'
        action, // 'add', 'edit', 'delete'
        data, // address object
        index, // for edit/delete
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
        // state.message = action.payload?.message || "User loaded successfully";
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
      // 5. RESEND OTP
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
      // 6. LOGOUT
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
      // 7. UPDATE USER
      // ========================================
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message = action.payload?.message || "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update user";
        state.message = state.error;
      })

      // ========================================
      // 8. UPDATE ADDRESS
      // ========================================
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message =
          action.payload?.message || "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
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
  resetAuthFlow,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
