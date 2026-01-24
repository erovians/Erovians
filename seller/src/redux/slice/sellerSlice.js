import api from "@/utils/axios.utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerSeller = createAsyncThunk(
  "seller/registerSeller",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/register", sellerData);
      console.log(response.data);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Server error" });
      }
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
    token: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSellerState: (state) => {
      state.seller = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.data; // ✅ Changed
        state.successMessage = action.payload.message;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
