import api from "@/utils/axios.utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ------------------ Existing Thunks ------------------

// Async thunk to add a product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/product/add", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Fetch all products for a company
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (companyId, { rejectWithValue }) => {
    try {
      const res = await api.get("/product/list", { params: { companyId } });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/product/${productId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// Update product status
export const updateProductStatus = createAsyncThunk(
  "products/updateProductStatus",
  async ({ productId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/product/${productId}/status`, { status });
      return { productId, status: res.data.data.status || status };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ------------------ New Thunks ------------------

// Bulk action for products
export const bulkActionProducts = createAsyncThunk(
  "products/bulkActionProducts",
  async ({ action, productIds }, { rejectWithValue }) => {
    try {
      if (action === "activate") {
        await api.post("/product/bulk-activate", { productIds });
      } else if (action === "deactivate") {
        await api.post("/product/bulk-deactivate", { productIds });
      } else if (action === "delete") {
        await api.post("/product/bulk-delete", { productIds });
      }
      return { action, productIds };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Bulk action failed"
      );
    }
  }
);

// ------------------ Slice ------------------
const productSlice = createSlice({
  name: "products",
  initialState: {
    product: null,
    products: [],
    loading: false,
    message: "",
    error: null,
    selectedProducts: [],
    bulkAction: "",
    statusCounts: { all: 0, active: 0, inactive: 0, pending: 0, violation: 0 },
  },
  reducers: {
    clearMessage: (state) => {
      state.message = "";
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
    setBulkAction: (state, action) => {
      state.bulkAction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing cases
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.message = action.payload.message;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;

        // Update status counts
        const counts = {
          all: action.payload.filter(
            (p) => p.status === "active" || p.status === "inactive"
          ).length,
          active: action.payload.filter((p) => p.status === "active").length,
          inactive: action.payload.filter((p) => p.status === "inactive")
            .length,
          pending: action.payload.filter((p) => p.status === "pending").length,
          violation: action.payload.filter((p) => p.status === "violation")
            .length,
        };
        state.statusCounts = counts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        const index = state.products.findIndex((p) => p._id === productId);
        if (index !== -1) state.products[index].status = status;
        if (state.product?._id === productId) state.product.status = status;
      })

      // Bulk action cases
      .addCase(bulkActionProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(bulkActionProducts.fulfilled, (state) => {
        state.loading = false;
        state.selectedProducts = [];
        state.bulkAction = "";
      })
      .addCase(bulkActionProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearMessage,
  clearProduct,
  setSelectedProducts,
  setBulkAction,
} = productSlice.actions;
export default productSlice.reducer;
