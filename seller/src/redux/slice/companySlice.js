import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

// ======================== REGISTER COMPANY ========================
export const registerCompany = createAsyncThunk(
  "company/registerCompany",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/company/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" }
      );
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

// ======================== UPDATE COMPANY ========================
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/company/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Update failed" }
      );
    }
  }
);

// ======================== DELETE COMPANY ========================
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete("/company/delete");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Delete failed" }
      );
    }
  }
);

// ======================== SLICE ========================
const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearCompanyState: (state) => {
      state.company = null;
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
      // ========== REGISTER COMPANY ==========
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload.company;
        state.message =
          action.payload.message || "Company registered successfully";
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
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
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch company";
      })

      // ========== UPDATE COMPANY ==========
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload.company;
        state.message =
          action.payload.message || "Company updated successfully";
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
        state.success = false;
      })

      // ========== DELETE COMPANY ==========
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = null;
        state.message =
          action.payload.message || "Company deleted successfully";
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Delete failed";
        state.success = false;
      });
  },
});

export const { clearCompanyState, clearError, clearSuccess } =
  companySlice.actions;
export default companySlice.reducer;
