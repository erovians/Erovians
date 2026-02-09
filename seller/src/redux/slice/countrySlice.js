import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { detectUserCountry, getBusinessIdConfig } from "@/utils/country.utils";

// ======================== DETECT COUNTRY (ASYNC THUNK) ========================
export const detectCountry = createAsyncThunk(
  "country/detectCountry",
  async (_, { rejectWithValue }) => {
    try {
      const countryCode = await detectUserCountry();
      return countryCode;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to detect country");
    }
  }
);

// ======================== SLICE ========================
const countrySlice = createSlice({
  name: "country",
  initialState: {
    detectedCountry: null,
    businessIdConfig: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setDetectedCountry: (state, action) => {
      state.detectedCountry = action.payload;
      state.businessIdConfig = getBusinessIdConfig(action.payload);
    },
    clearCountryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectCountry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(detectCountry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detectedCountry = action.payload;
        state.businessIdConfig = getBusinessIdConfig(action.payload);
      })
      .addCase(detectCountry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Fallback to India
        state.detectedCountry = "IN";
        state.businessIdConfig = getBusinessIdConfig("IN");
      });
  },
});

export const { setDetectedCountry, clearCountryError } = countrySlice.actions;
export default countrySlice.reducer;
