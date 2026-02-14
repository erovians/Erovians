import api from "@/utils/axios.utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendOtp = createAsyncThunk(
  "seller/sendOtp",
  async (mobile, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/send-otp", { mobile });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "seller/verifyOtp",
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/verify-otp", { mobile, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to verify OTP" }
      );
    }
  }
);

export const checkUnique = createAsyncThunk(
  "seller/checkUnique",
  async (
    { email, businessId, mobile, seller_country },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/seller/check-unique", {
        email,
        businessId,
        mobile,
        seller_country,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Validation failed" }
      );
    }
  }
);

export const registerSeller = createAsyncThunk(
  "seller/registerSeller",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/register", sellerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const loginSeller = createAsyncThunk(
  "seller/loginSeller",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/login", {
        identifier,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const loadSeller = createAsyncThunk(
  "seller/loadSeller",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load seller" }
      );
    }
  }
);

export const logoutSeller = createAsyncThunk(
  "seller/logoutSeller",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    isAuthenticated: false,
    user: null,
    seller: null,
    permissions: null,
    isLoadingOtp: false,
    isLoadingVerify: false,
    isLoadingCheck: false,
    isLoadingRegister: false,
    isLoadingLogin: false,
    isLoadingProfile: false,
    isLoadingLogout: false,
    otpStatus: "idle",
    isMobileVerified: false,
    isUniquenessChecked: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSellerState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.seller = null;
      state.permissions = null;
      state.isLoadingOtp = false;
      state.isLoadingVerify = false;
      state.isLoadingCheck = false;
      state.isLoadingRegister = false;
      state.isLoadingLogin = false;
      state.isLoadingProfile = false;
      state.isLoadingLogout = false;
      state.error = null;
      state.successMessage = null;
      state.otpStatus = "idle";
      state.isMobileVerified = false;
      state.isUniquenessChecked = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    resetOtpStatus: (state) => {
      state.otpStatus = "idle";
      state.isMobileVerified = false;
    },
    resetUniquenessCheck: (state) => {
      state.isUniquenessChecked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoadingOtp = true;
        state.error = null;
        state.otpStatus = "sending";
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoadingOtp = false;
        state.otpStatus = "sent";
        state.successMessage = action.payload.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoadingOtp = false;
        state.otpStatus = "idle";
        state.error = action.payload?.message || "Failed to send OTP";
      })

      .addCase(verifyOtp.pending, (state) => {
        state.isLoadingVerify = true;
        state.error = null;
        state.otpStatus = "verifying";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoadingVerify = false;
        state.otpStatus = "verified";
        state.isMobileVerified = true;
        state.successMessage = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoadingVerify = false;
        state.otpStatus = "sent";
        state.error = action.payload?.message || "Invalid or expired OTP";
      })

      .addCase(checkUnique.pending, (state) => {
        state.isLoadingCheck = true;
        state.error = null;
        state.isUniquenessChecked = false;
      })
      .addCase(checkUnique.fulfilled, (state, action) => {
        state.isLoadingCheck = false;
        state.isUniquenessChecked = true;
        state.successMessage = action.payload.message;
      })
      .addCase(checkUnique.rejected, (state, action) => {
        state.isLoadingCheck = false;
        state.isUniquenessChecked = false;
        state.error = action.payload?.message || "Validation failed";
      })

      .addCase(registerSeller.pending, (state) => {
        state.isLoadingRegister = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.isLoadingRegister = false;
        state.successMessage = action.payload.message;
        state.otpStatus = "idle";
        state.isMobileVerified = false;
        state.isUniquenessChecked = false;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.isLoadingRegister = false;
        state.error = action.payload?.message || "Registration failed";
      })

      .addCase(loginSeller.pending, (state) => {
        state.isLoadingLogin = true;
        state.error = null;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.isLoadingLogin = false;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message;
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.isLoadingLogin = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed";
      })

      .addCase(loadSeller.pending, (state) => {
        state.isLoadingProfile = true;
        state.error = null;
      })
      .addCase(loadSeller.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.seller = action.payload.data.seller;
        state.permissions = action.payload.data.permissions;
      })
      .addCase(loadSeller.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.isAuthenticated = false;
        state.user = null;
        state.seller = null;
        state.permissions = null;
        state.error = action.payload?.message || "Failed to load seller";
      })

      .addCase(logoutSeller.pending, (state) => {
        state.isLoadingLogout = true;
      })
      .addCase(logoutSeller.fulfilled, (state) => {
        state.isLoadingLogout = false;
        state.isAuthenticated = false;
        state.user = null;
        state.seller = null;
        state.permissions = null;
        state.successMessage = "Logged out successfully";
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutSeller.rejected, (state, action) => {
        state.isLoadingLogout = false;
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export const {
  clearSellerState,
  clearError,
  clearSuccess,
  resetOtpStatus,
  resetUniquenessCheck,
} = sellerSlice.actions;
export default sellerSlice.reducer;
