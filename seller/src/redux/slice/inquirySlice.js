import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

// --- Fetch all inquiries for seller ---
export const fetchInquiries = createAsyncThunk(
  "inquiries/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/inquiry/sellerquote");
      return res.data.quotations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching inquiries"
      );
    }
  }
);

// --- Fetch single inquiry by ID ---
export const fetchInquiryById = createAsyncThunk(
  "inquiries/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/inquiry/sellerquote/${id}`);
      return res.data.quotation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching inquiry"
      );
    }
  }
);

const inquirySlice = createSlice({
  name: "inquiries",
  initialState: {
    list: [],
    selectedInquiry: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedInquiry: (state) => {
      state.selectedInquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchInquiryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInquiry = action.payload;
      })
      .addCase(fetchInquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;
