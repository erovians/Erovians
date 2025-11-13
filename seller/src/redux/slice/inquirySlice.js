import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

// --- Fetch all inquiries for seller ---
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
      showOnlyUnread = false,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        tab,
        statusTab,
        sortBy,
        showOnlyUnread: String(showOnlyUnread),
      });
      if (q) params.append("q", q);

      const res = await api.get(`/inquiry/?${params.toString()}`);
      return res.data;
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
      const res = await api.get(`/inquiry/details/${id}`);
      console.log(res.data);
      
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching inquiry"
      );
    }
  }
);

// --- Mark inquiry as viewed (clear isNew flag) ---
export const markInquiryAsViewed = createAsyncThunk(
  "inquiries/markAsViewed",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/inquiry/${id}/mark-viewed`);
      return { id, inquiry: res.data.inquiry };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error marking inquiry as viewed"
      );
    }
  }
);

// --- Perform Bulk Action ---
export const performBulkInquiryAction = createAsyncThunk(
  "inquiries/bulkAction",
  async ({ action, ids, meta = {} }, { rejectWithValue }) => {
    if (!ids || ids.length === 0) {
      return rejectWithValue("No inquiries selected");
    }
    try {
      const res = await api.post("/inquiry/bulk/action", {
        action,
        ids,
        meta,
      });
      return { action, ...res.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error performing bulk action"
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
    bulkActionLoading: false,
  },
  reducers: {
    clearSelectedInquiry: (state) => {
      state.selectedInquiry = null;
    },
    // Optimistic update for marking as viewed
    optimisticallyMarkAsViewed: (state, action) => {
      const id = action.payload;
      const inquiry = state.list.find((inq) => inq._id === id);
      if (inquiry) {
        inquiry.isNew = false;
      }
      // Decrement the new inquiry count
      if (state.counts.totalNew > 0) {
        state.counts.totalNew -= 1;
      }
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
        state.list = action.payload.items || [];
        state.counts = action.payload.counts || {};
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
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
      })

      // Mark as viewed
      .addCase(markInquiryAsViewed.fulfilled, (state, action) => {
        const { id } = action.payload;
        const inquiry = state.list.find((inq) => inq._id === id);
        if (inquiry) {
          inquiry.isNew = false;
        }
        // Update counts
        if (state.counts.totalNew > 0) {
          state.counts.totalNew -= 1;
        }
      })

      // Bulk actions
      .addCase(performBulkInquiryAction.pending, (state) => {
        state.bulkActionLoading = true;
      })
      .addCase(performBulkInquiryAction.fulfilled, (state) => {
        state.bulkActionLoading = false;
      })
      .addCase(performBulkInquiryAction.rejected, (state, action) => {
        state.bulkActionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedInquiry, optimisticallyMarkAsViewed } =
  inquirySlice.actions;
export default inquirySlice.reducer;