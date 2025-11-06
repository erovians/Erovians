import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

// --- Fetch all inquiries for seller ---
// redux/slice/inquirySlice.js
export const fetchInquiries = createAsyncThunk(
  "inquiries/fetchAll",
  async (
    {
      page = 1,
      limit = 25,
      tab = "All",
      statusTab = "All",
      sortBy = "Latest",
      q = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        tab,
        statusTab,
        sortBy,
      });
      if (q) params.append("q", q);

      const res = await api.get(`/inquiry/?${params.toString()}`);
      console.log(res.data)
      return res.data; // { items, total, page, limit, counts }
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
    counts: {},
    page: 1,
    limit: 25,
    total: 0,
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
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items || [];
        state.counts = action.payload.counts || {};
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
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
