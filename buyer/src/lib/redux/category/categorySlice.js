import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  // All categories data
  categories: [],

  // Products from category/subcategory
  products: [],
  search: {
    products: [],
    companies: [],
    loading: false,
    error: null,
  },
  searchLoading: false,

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    limit: 10,
  },

  // Category product filters
  categoryFilters: {
    subCategory: [],
    grade: [],
    color: [],
    origin: "",
    priceMin: null,
    priceMax: null,
    lengthMin: null,
    lengthMax: null,
    widthMin: null,
    widthMax: null,
    thicknessMin: null,
    thicknessMax: null,
    weightMin: null,
    weightMax: null,
    sortBy: "",
    newArrivals: false,
  },

  loading: false,
  error: null,
};

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Fetch all categories
 * GET /api/v2/category/all
 */
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/category/all");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to fetch categories",
        }
      );
    }
  }
);

/**
 * Fetch products by category
 * GET /api/v2/category/:categorySlug/products
 */
export const fetchCategoryProducts = createAsyncThunk(
  "category/fetchCategoryProducts",
  async (
    { categorySlug, page = 1, limit = 10, filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (filters.subCategory?.length > 0) {
        params.append("subCategory", filters.subCategory.join(","));
      }
      if (filters.grade?.length > 0) {
        params.append("grade", filters.grade.join(","));
      }
      if (filters.color?.length > 0) {
        params.append("color", filters.color.join(","));
      }
      if (filters.origin) params.append("origin", filters.origin);
      if (filters.priceMin) params.append("priceMin", filters.priceMin);
      if (filters.priceMax) params.append("priceMax", filters.priceMax);
      if (filters.lengthMin) params.append("lengthMin", filters.lengthMin);
      if (filters.lengthMax) params.append("lengthMax", filters.lengthMax);
      if (filters.widthMin) params.append("widthMin", filters.widthMin);
      if (filters.widthMax) params.append("widthMax", filters.widthMax);
      if (filters.thicknessMin)
        params.append("thicknessMin", filters.thicknessMin);
      if (filters.thicknessMax)
        params.append("thicknessMax", filters.thicknessMax);
      if (filters.weightMin) params.append("weightMin", filters.weightMin);
      if (filters.weightMax) params.append("weightMax", filters.weightMax);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.newArrivals) {
        params.append("newArrivals", "true");
      }

      const response = await api.get(
        `/category/${categorySlug}/products?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to fetch category products",
        }
      );
    }
  }
);

/**
 * Fetch products by subcategory
 * GET /api/v2/category/:categorySlug/:subCategorySlug/products
 */
export const fetchSubCategoryProducts = createAsyncThunk(
  "category/fetchSubCategoryProducts",
  async (
    { categorySlug, subCategorySlug, page = 1, limit = 10, filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (filters.grade?.length > 0) {
        params.append("grade", filters.grade.join(","));
      }
      if (filters.color?.length > 0) {
        params.append("color", filters.color.join(","));
      }
      if (filters.origin) params.append("origin", filters.origin);
      if (filters.priceMin) params.append("priceMin", filters.priceMin);
      if (filters.priceMax) params.append("priceMax", filters.priceMax);
      if (filters.lengthMin) params.append("lengthMin", filters.lengthMin);
      if (filters.lengthMax) params.append("lengthMax", filters.lengthMax);
      if (filters.widthMin) params.append("widthMin", filters.widthMin);
      if (filters.widthMax) params.append("widthMax", filters.widthMax);
      if (filters.thicknessMin)
        params.append("thicknessMin", filters.thicknessMin);
      if (filters.thicknessMax)
        params.append("thicknessMax", filters.thicknessMax);
      if (filters.weightMin) params.append("weightMin", filters.weightMin);
      if (filters.weightMax) params.append("weightMax", filters.weightMax);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.newArrivals) {
        params.append("newArrivals", "true");
      }

      const response = await api.get(
        `/category/${categorySlug}/${subCategorySlug}/products?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Failed to fetch subcategory products",
        }
      );
    }
  }
);

export const universalSearch = createAsyncThunk(
  "category/universalSearch",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await api.get(`/category/search?q=${searchQuery}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: "Search failed",
        }
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Set category filters
    setCategoryFilters: (state, action) => {
      state.categoryFilters = { ...state.categoryFilters, ...action.payload };
    },

    // Clear category filters
    clearCategoryFilters: (state) => {
      state.categoryFilters = initialState.categoryFilters;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset entire category state
    resetCategoryState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // ============================================
      // Fetch All Categories
      // ============================================
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || [];
        state.error = null;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })

      // ============================================
      // Fetch Category Products
      // ============================================
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = action.payload.products || [];
          state.pagination = {
            currentPage: action.payload.pagination.currentPage,
            totalPages: action.payload.pagination.totalPages,
            totalProducts: action.payload.pagination.totalProducts,
            limit: action.payload.pagination.limit,
          };
        }
        state.error = null;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch category products";
      })

      // ============================================
      // Fetch SubCategory Products
      // ============================================
      .addCase(fetchSubCategoryProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = action.payload.products || [];
          state.pagination = {
            currentPage: action.payload.pagination.currentPage,
            totalPages: action.payload.pagination.totalPages,
            totalProducts: action.payload.pagination.totalProducts,
            limit: action.payload.pagination.limit,
          };
        }
        state.error = null;
      })
      .addCase(fetchSubCategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch subcategory products";
      })
      .addCase(universalSearch.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(universalSearch.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.products = action.payload.products || [];
        state.search.companies = action.payload.companies || [];
        state.search.error = null;
      })
      .addCase(universalSearch.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload?.message || "Search failed";
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  setCategoryFilters,
  clearCategoryFilters,
  clearError,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;
