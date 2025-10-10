import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

// Async thunk: Register company
export const registerCompany = createAsyncThunk(
  "company/registerCompany",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/company/register", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Async thunk: Edit company (optional)
export const editCompany = createAsyncThunk(
  "company/editCompany",
  async ({ companyId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/company/${companyId}/edit`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// GET company details
export const getCompany = createAsyncThunk(
  "company/getCompany",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`/company/details`,{ params });
      console.log(res.data);
      return res.data; // { company: {...} }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch company details"
      );
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      // Register Company
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
        state.error = action.payload;
        state.success = false;
      })

      // Edit Company
      .addCase(editCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload.company;
        state.message =
          action.payload.message || "Company updated successfully";
      })
      .addCase(editCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // GET Company
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyState } = companySlice.actions;
export default companySlice.reducer;
