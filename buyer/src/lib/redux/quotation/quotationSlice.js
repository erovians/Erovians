import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ==================== ASYNC THUNKS ====================

// Create Quotation Request
export const createQuotationRequest = createAsyncThunk(
  "quotation/createQuotationRequest",
  async (quotationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      formData.append("quotation_type", quotationData.quotation_type);

      if (quotationData.userId) {
        formData.append("userId", quotationData.userId);
      }

      if (quotationData.sellerId) {
        formData.append("sellerId", quotationData.sellerId);
      }

      if (quotationData.productId) {
        formData.append("productId", quotationData.productId);
      }

      if (quotationData.category) {
        formData.append("category", quotationData.category);
      }

      if (
        quotationData.subcategories &&
        quotationData.subcategories.length > 0
      ) {
        formData.append(
          "subcategories",
          JSON.stringify(quotationData.subcategories)
        );
      }

      formData.append("quantity", quotationData.quantity);
      formData.append("unit", quotationData.unit);

      if (quotationData.message) {
        formData.append("message", quotationData.message);
      }

      if (quotationData.requirements) {
        formData.append("requirements", quotationData.requirements);
      }

      if (quotationData.specifications) {
        formData.append("specifications", quotationData.specifications);
      }

      formData.append("timeline", quotationData.timeline);
      formData.append("location", quotationData.location);

      if (quotationData.budgetMin) {
        formData.append("budgetMin", quotationData.budgetMin);
      }

      if (quotationData.budgetMax) {
        formData.append("budgetMax", quotationData.budgetMax);
      }

      if (quotationData.contactEmail) {
        formData.append("contactEmail", quotationData.contactEmail);
      }

      if (quotationData.contactPhone) {
        formData.append("contactPhone", quotationData.contactPhone);
      }

      // Append files
      if (
        quotationData.uploadedFiles &&
        quotationData.uploadedFiles.length > 0
      ) {
        quotationData.uploadedFiles.forEach((fileObj) => {
          formData.append("files", fileObj.file);
        });
      }

      const response = await api.post("/quotation/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create quotation request"
      );
    }
  }
);

// Get Seller's Quotations
export const getSellerQuotations = createAsyncThunk(
  "quotation/getSellerQuotations",
  async ({ sellerId, status = null }, { rejectWithValue }) => {
    try {
      const url = status
        ? `/quotations/seller/${sellerId}?status=${status}`
        : `/quotations/seller/${sellerId}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quotations"
      );
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState = {
  // Quotations data
  quotations: [],
  currentQuotation: null,

  // Pagination & Filters
  totalQuotations: 0,
  currentPage: 1,
  totalPages: 1,
  filter: {
    status: null,
    type: null,
  },

  // Loading states
  loading: false,
  createLoading: false,
  responseLoading: false,

  // Success/Error states
  success: false,
  error: null,
  successMessage: null,

  // Metadata
  sellersNotified: 0,
};

// ==================== SLICE ====================
const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Clear success message
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },

    // Reset quotation state
    resetQuotationState: (state) => {
      state.quotations = [];
      state.currentQuotation = null;
      state.loading = false;
      state.createLoading = false;
      state.responseLoading = false;
      state.success = false;
      state.error = null;
      state.successMessage = null;
      state.sellersNotified = 0;
    },

    // Set filter
    setQuotationFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },

    // Clear current quotation
    clearCurrentQuotation: (state) => {
      state.currentQuotation = null;
    },
  },

  extraReducers: (builder) => {
    // ==================== CREATE QUOTATION ====================
    builder
      .addCase(createQuotationRequest.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
        state.successMessage = null;
      })
      .addCase(createQuotationRequest.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.successMessage =
          action.payload.message || "Quotation created successfully";
        state.currentQuotation = action.payload.data.quotation;
        state.sellersNotified = action.payload.data.sellersNotified || 0;

        // Add to quotations list
        state.quotations.unshift(action.payload.data.quotation);
        state.totalQuotations += 1;
      })
      .addCase(createQuotationRequest.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.success = false;
      });

    // ==================== GET SELLER QUOTATIONS ====================
    builder
      .addCase(getSellerQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations =
          action.payload.data.quotations || action.payload.data;
        state.totalQuotations =
          action.payload.data.total || action.payload.data.length;
        state.totalPages = action.payload.data.totalPages || 1;
        state.currentPage = action.payload.data.currentPage || 1;
      })
      .addCase(getSellerQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.quotations = [];
      });
  },
});

// ==================== EXPORT ACTIONS ====================
export const {
  clearError,
  clearSuccess,
  resetQuotationState,
  setQuotationFilter,
  clearCurrentQuotation,
} = quotationSlice.actions;

// ==================== EXPORT REDUCER ====================
export default quotationSlice.reducer;
