import api from "@/utils/axios.utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ======================== SEND OTP ========================
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

// ======================== VERIFY OTP ========================
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

// ======================== CHECK UNIQUENESS ========================
export const checkUnique = createAsyncThunk(
  "seller/checkUnique",
  async ({ email, businessId, mobile }, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/check-unique", {
        email,
        businessId,
        mobile,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Validation failed" }
      );
    }
  }
);

// ======================== REGISTER SELLER ========================
export const registerSeller = createAsyncThunk(
  "seller/registerSeller",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/register", sellerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// ======================== LOAD SELLER ========================
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

// ======================== SLICE ========================
const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
    token: null,
    loading: false,
    error: null,
    successMessage: null,
    otpStatus: "idle",
    isMobileVerified: false,
    isUniquenessChecked: false,
  },
  reducers: {
    setSeller: (state, action) => {
      state.seller = action.payload;
    },
    clearSellerState: (state) => {
      state.seller = null;
      state.token = null;
      state.loading = false;
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
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== SEND OTP ==========
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpStatus = "sending";
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = "sent";
        state.successMessage =
          action.payload.message || "OTP sent successfully";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpStatus = "idle";
        state.error = action.payload?.message || "Failed to send OTP";
      })

      // ========== VERIFY OTP ==========
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = "verified";
        state.isMobileVerified = true;
        state.successMessage =
          action.payload.message || "Mobile verified successfully";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Invalid or expired OTP";
      })

      // ========== CHECK UNIQUENESS ==========
      .addCase(checkUnique.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUniquenessChecked = false;
      })
      .addCase(checkUnique.fulfilled, (state, action) => {
        state.loading = false;
        state.isUniquenessChecked = true;
        state.successMessage =
          action.payload.message || "Validation successful";
      })
      .addCase(checkUnique.rejected, (state, action) => {
        state.loading = false;
        state.isUniquenessChecked = false;
        state.error = action.payload?.message || "Validation failed";
      })

      // ========== REGISTER SELLER ==========
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data;
        state.successMessage =
          action.payload.message || "Registration successful";
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // ========== LOAD SELLER ==========
      .addCase(loadSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data;
      })
      .addCase(loadSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load seller";
      });
  },
});

export const {
  clearSellerState,
  clearError,
  setSeller,
  clearSuccess,
  resetOtpStatus,
} = sellerSlice.actions;
export default sellerSlice.reducer;
