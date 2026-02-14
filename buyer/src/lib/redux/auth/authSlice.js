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
  authMode: "login",
  loginType: null,
  hasPassword: false,
  otpSent: false,
  otpPurpose: null,
  otpExpiresAt: null,
  requiresVerification: false,
  nextRoute: null,
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
          message: "Failed to load user",
        }
      );
    }
  }
);

export const checkUserAndSendOTP = createAsyncThunk(
  "auth/checkUserAndSendOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/check-user", formData);
      return { ...response.data, intendedRoute: formData.intendedRoute };
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

export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login-password", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { success: false, message: "Login failed" }
      );
    }
  }
);

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

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { success: false, message: "Failed to logout" }
      );
    }
  }
);

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
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || "Failed to load user";
      })

      .addCase(checkUserAndSendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkUserAndSendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.otpSent = true;
        state.isNewUser = action.payload?.isNewUser || false;
        state.identifier = action.payload?.identifier || state.identifier;
        state.otpPurpose = action.payload?.otpPurpose || "login";
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
        state.requiresVerification = true;
        state.hasPassword = action.payload?.hasPassword || false;
        state.message = action.payload?.message || "OTP sent successfully";
        state.nextRoute = action.payload?.intendedRoute || "/";

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
        state.error = action.payload?.message || "Failed to send OTP";
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
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

          if (action.payload?.accessToken) {
            localStorage.setItem("accessToken", action.payload.accessToken);
          }
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.step = "initial";
        state.isNewUser = false;
        state.requiresVerification = false;
        state.otpPurpose = null;
        state.otpExpiresAt = null;
        state.message =
          action.payload?.message || "Registration completed successfully";

        if (action.payload?.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Registration failed";
      })

      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.step = "initial";
        state.message = action.payload?.message || "Login successful";

        if (action.payload?.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Login failed";
      })

      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.otpExpiresAt = action.payload?.otpExpiresAt || null;
        state.message = action.payload?.message || "OTP resent successfully";
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to resend OTP";
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return {
          ...initialState,
          message: action.payload?.message || "Logged out successfully",
          success: true,
        };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to logout";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return { ...initialState, error: state.error };
      })

      .addCase(updateUser.pending, (state, action) => {
        const payload = action.meta.arg;
        if (payload.buyer_data) {
          state.buyerLoading = true;
        } else {
          state.profileLoading = true;
        }
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.buyerLoading = false;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message = action.payload?.message || "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.profileLoading = false;
        state.buyerLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to update user";
      })

      .addCase(updateAddress.pending, (state) => {
        state.addressLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.success = true;
        state.user = action.payload?.data || state.user;
        state.message =
          action.payload?.message || "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to update address";
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
