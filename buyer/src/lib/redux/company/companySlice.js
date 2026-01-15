import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  companies: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCompanies: 0,
    limit: 10,
  },
  filters: {
    mainCategory: [],
    subCategory: [],
    country: "",
    state: "",
    city: "",
    yearFrom: null,
    yearTo: null,
    paymentMethods: [],
    currency: [],
    language: [],
    newArrivals: false,
  },
  loading: false,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (filters.mainCategory?.length > 0) {
        params.append("mainCategory", filters.mainCategory.join(","));
      }
      if (filters.subCategory?.length > 0) {
        params.append("subCategory", filters.subCategory.join(","));
      }
      if (filters.country) params.append("country", filters.country);
      if (filters.state) params.append("state", filters.state);
      if (filters.city) params.append("city", filters.city);
      if (filters.yearFrom) params.append("yearFrom", filters.yearFrom);
      if (filters.yearTo) params.append("yearTo", filters.yearTo);
      if (filters.paymentMethods?.length > 0) {
        params.append("paymentMethods", filters.paymentMethods.join(","));
      }
      if (filters.currency?.length > 0) {
        params.append("currency", filters.currency.join(","));
      }
      if (filters.language?.length > 0) {
        params.append("language", filters.language.join(","));
      }
      if (filters.newArrivals) {
        params.append("newArrivals", "true");
      }

      const response = await api.get(
        `/company/fetch-company?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to fetch companies",
        }
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCompanyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch companies";
      });
  },
});

export const { setFilters, clearFilters, clearError, resetCompanyState } =
  companySlice.actions;
export default companySlice.reducer;
