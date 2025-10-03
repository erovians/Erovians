// store/productSlice.js
import api from "@/utils/axios.utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

const productSlice = createSlice({
  name: "products",
  initialState: {
    product: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = "";
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single product
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

      // Update product status
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        const index = state.products.findIndex((p) => p._id === productId);
        if (index !== -1) state.products[index].status = status;
        if (state.product?._id === productId) state.product.status = status;
      });
  },
});

export const { clearMessage } = productSlice.actions;
export default productSlice.reducer;
