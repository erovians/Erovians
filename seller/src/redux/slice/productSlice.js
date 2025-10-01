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
      });
  },
});

export const { clearMessage } = productSlice.actions;
export default productSlice.reducer;
