import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  companies: [],
  products: [],
  productDetail: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCompanies: 0,
    totalProducts: 0,
    limit: 10,
  },

  // Separate filters for company
  companyFilters: {
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

  // ✅ UPDATED - Product filters with NEW fields
  productFilters: {
    category: [],
    subCategory: [],
    grade: [],
    color: [], // ✅ Changed to array for multiple colors
    origin: "",
    priceMin: null,
    priceMax: null,
    lengthMin: null, // ✅ NEW
    lengthMax: null, // ✅ NEW
    widthMin: null, // ✅ NEW
    widthMax: null, // ✅ NEW
    thicknessMin: null, // ✅ NEW
    thicknessMax: null, // ✅ NEW
    weightMin: null, // ✅ NEW
    weightMax: null, // ✅ NEW
    sortBy: "", // ✅ NEW - priceAsc, priceDesc, newest, mostViewed
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

// ✅ UPDATED - fetchCompaniesProduct with new filters
export const fetchCompaniesProduct = createAsyncThunk(
  "company/fetchCompaniesProduct",
  async (
    { companyId, page = 1, limit = 10, filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (filters.category?.length > 0) {
        params.append("category", filters.category.join(","));
      }
      if (filters.subCategory?.length > 0) {
        params.append("subCategory", filters.subCategory.join(","));
      }
      if (filters.grade?.length > 0) {
        params.append("grade", filters.grade.join(","));
      }
      // ✅ Color - Now array
      if (filters.color?.length > 0) {
        params.append("color", filters.color.join(","));
      }
      if (filters.origin) params.append("origin", filters.origin);
      if (filters.priceMin) params.append("priceMin", filters.priceMin);
      if (filters.priceMax) params.append("priceMax", filters.priceMax);

      // ✅ NEW - Size filters
      if (filters.lengthMin) params.append("lengthMin", filters.lengthMin);
      if (filters.lengthMax) params.append("lengthMax", filters.lengthMax);
      if (filters.widthMin) params.append("widthMin", filters.widthMin);
      if (filters.widthMax) params.append("widthMax", filters.widthMax);
      if (filters.thicknessMin)
        params.append("thicknessMin", filters.thicknessMin);
      if (filters.thicknessMax)
        params.append("thicknessMax", filters.thicknessMax);

      // ✅ NEW - Weight filter
      if (filters.weightMin) params.append("weightMin", filters.weightMin);
      if (filters.weightMax) params.append("weightMax", filters.weightMax);

      // ✅ NEW - Sort filter
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      if (filters.newArrivals) {
        params.append("newArrivals", "true");
      }

      const response = await api.get(
        `/company/fetch/${companyId}/product?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to fetch companies products",
        }
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "company/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company/fetch/${productId}/detail`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to fetch product details",
        }
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    // Company filters
    setCompanyFilters: (state, action) => {
      state.companyFilters = { ...state.companyFilters, ...action.payload };
    },
    clearCompanyFilters: (state) => {
      state.companyFilters = initialState.companyFilters;
    },

    // Product filters
    setProductFilters: (state, action) => {
      state.productFilters = { ...state.productFilters, ...action.payload };
    },
    clearProductFilters: (state) => {
      state.productFilters = initialState.productFilters;
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
        state.pagination = {
          ...state.pagination,
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalCompanies: action.payload.pagination.totalCompanies,
          limit: action.payload.pagination.limit,
        };
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch companies";
      })

      // for company product
      .addCase(fetchCompaniesProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = action.payload.products || [];
          state.pagination = {
            ...state.pagination,
            currentPage: action.payload.pagination.currentPage,
            totalPages: action.payload.pagination.totalPages,
            totalProducts: action.payload.pagination.totalProducts,
            limit: action.payload.pagination.limit,
          };
        }
        state.error = null;
      })
      .addCase(fetchCompaniesProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.productDetail = null;
        state.error =
          action.payload?.message || "Failed to fetch product details";
      });
  },
});

export const {
  setCompanyFilters,
  clearCompanyFilters,
  setProductFilters,
  clearProductFilters,
  clearError,
  resetCompanyState,
} = companySlice.actions;

export default companySlice.reducer;
