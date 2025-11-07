// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/utils/axios.utils";

// // --- Fetch all inquiries for seller ---
// // redux/slice/inquirySlice.js
// export const fetchInquiries = createAsyncThunk(
//   "inquiries/fetchAll",
//   async (
//     {
//       page = 1,
//       limit = 25,
//       tab = "All",
//       statusTab = "All",
//       sortBy = "Latest",
//       q = "",
//     } = {},
//     { rejectWithValue }
//   ) => {
//     try {
//       const params = new URLSearchParams({
//         page,
//         limit,
//         tab,
//         statusTab,
//         sortBy,
//       });
//       if (q) params.append("q", q);

//       const res = await api.get(`/inquiry/?${params.toString()}`);
//       console.log(res.data);
//       return res.data; // { items, total, page, limit, counts }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Error fetching inquiries"
//       );
//     }
//   }
// );

// // --- Fetch single inquiry by ID ---
// export const fetchInquiryById = createAsyncThunk(
//   "inquiries/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/inquiry/sellerquote/${id}`);
//       return res.data.quotation;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Error fetching inquiry"
//       );
//     }
//   }
// );

// // BULK ACTION
// export const bulkInquiriesAction = createAsyncThunk(
//   "inquiries/bulkAction",
//   async ({ ids, action, meta, orderId }, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/inquiry/bulk", {
//         ids,
//         action,
//         meta,
//         orderId,
//       });
//       return { ids, action, result: res.data.result }; // keep light
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Bulk action failed"
//       );
//     }
//   }
// );

// // SINGLE ACTION (optional, if you need per-row actions)
// export const singleInquiryAction = createAsyncThunk(
//   "inquiries/singleAction",
//   async ({ id, action, meta, orderId }, { rejectWithValue }) => {
//     try {
//       const res = await api.patch(`/inquiry/${id}/action`, {
//         action,
//         meta,
//         orderId,
//       });
//       return res.data.inquiry;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Action failed");
//     }
//   }
// );

// const applyBulkMutation = (items, ids, action) => {
//   const set = new Set(ids);
//   return items.map((it) => {
//     if (!set.has(it._id)) return it;
//     switch (action) {
//       case "mark_read":
//         return { ...it, readInfo: { ...(it.readInfo || {}), isRead: true } };
//       case "mark_unread":
//         return { ...it, readInfo: { ...(it.readInfo || {}), isRead: false } };
//       case "mark_spam":
//         return { ...it, isSpam: true, isDeleted: false };
//       case "unmark_spam":
//         return { ...it, isSpam: false };
//       case "delete": // soft-delete
//         return { ...it, isDeleted: true };
//       case "restore":
//         return { ...it, isDeleted: false };
//       case "flag":
//         return { ...it, isFlagged: true };
//       case "unflag":
//         return { ...it, isFlagged: false };
//       default:
//         return it;
//     }
//   });
// };

// const inquirySlice = createSlice({
//   name: "inquiries",
//   initialState: {
//     list: [],
//     counts: {},
//     page: 1,
//     limit: 25,
//     total: 0,
//     selectedInquiry: null,
//     acting: false,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearSelectedInquiry: (state) => {
//       state.selectedInquiry = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all
//       .addCase(fetchInquiries.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload.items || [];
//         state.counts = action.payload.counts || {};
//         state.page = action.payload.page;
//         state.limit = action.payload.limit;
//         state.total = action.payload.total;
//       })

//       // Fetch single
//       .addCase(fetchInquiryById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchInquiryById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedInquiry = action.payload;
//       })
//       .addCase(fetchInquiryById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearSelectedInquiry } = inquirySlice.actions;
// export default inquirySlice.reducer;


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
      showOnlyUnread = false, // Add this
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
        showOnlyUnread, // Add this
      });
      if (q) params.append("q", q);

      const res = await api.get(`/inquiry/?${params.toString()}`);
      console.log(res.data);
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

// --- Perform Bulk Action ---
export const performBulkInquiryAction = createAsyncThunk(
  "inquiries/bulkAction",
  async ({ action, ids, meta = {} }, { rejectWithValue }) => {
    if (!ids || ids.length === 0) {
      return rejectWithValue("No inquiries selected");
    }
    try {
      const res = await api.post("/inquiry/bulk/action", {
        action, // e.g., 'delete', 'mark_spam', 'mark_read'
        ids,
        meta,
      });
      // Return the action and response, so we know what finished
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

      // --- Add cases for bulk actions ---
      .addCase(performBulkInquiryAction.pending, (state) => {
        // You can set a specific bulk-loading state if you want
        // For now, we'll re-use the main loading state
        state.loading = true;
      })
      .addCase(performBulkInquiryAction.fulfilled, (state, action) => {
        // The list will be re-fetched by the component,
        // so we just need to stop loading.
        state.loading = false;
        console.log("Bulk action success:", action.payload.action);
      })
      .addCase(performBulkInquiryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Show the error
      });
  },
});

export const { clearSelectedInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;