import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

// ======================== SAVE COMPANY (CREATE + UPDATE) ========================
export const saveCompany = createAsyncThunk(
  "company/saveCompany",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/company/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Save failed" });
    }
  }
);

// ======================== GET COMPANY DETAILS ========================
export const getCompany = createAsyncThunk(
  "company/getCompany",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/company/details");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch company details" }
      );
    }
  }
);

// ======================== SLICE ========================
const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    seller_status: null,
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearCompanyState: (state) => {
      state.company = null;
      state.seller_status = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== SAVE COMPANY (CREATE + UPDATE) ==========
      .addCase(saveCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload.company;
        state.seller_status = action.payload.seller_status;
        state.message = action.payload.message || "Company saved successfully";
      })
      .addCase(saveCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Save failed";
        state.success = false;
      })

      // ========== GET COMPANY ==========
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null;
        state.seller_status = action.payload.seller_status || null;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
        const errorMsg = action.payload?.message || "Failed to fetch company";
        if (errorMsg.toLowerCase().includes("not found")) {
          state.company = null;
        } else {
          state.error = errorMsg;
        }
      });
  },
});

export const { clearCompanyState, clearError, clearSuccess } =
  companySlice.actions;
export default companySlice.reducer;
