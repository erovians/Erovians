// import api from "@/utils/axios.utils";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const registerSeller = createAsyncThunk(
//   "seller/registerSeller",
//   async (sellerData, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/seller/register", sellerData);
//       console.log(response.data);
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(error.response.data);
//       } else {
//         return rejectWithValue({ message: "Server error" });
//       }
//     }
//   }
// );

// const sellerSlice = createSlice({
//   name: "seller",
//   initialState: {
//     seller: null,
//     token: null,
//     loading: false,
//     error: null,
//     successMessage: null,
//   },
//   reducers: {
//     clearSellerState: (state) => {
//       state.seller = null;
//       state.token = null;
//       state.loading = false;
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerSeller.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(registerSeller.fulfilled, (state, action) => {
//         state.loading = false;
//         state.seller = action.payload.seller;
//         state.token = action.payload.token;
//         state.successMessage = action.payload.message;
//       })
//       .addCase(registerSeller.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload.message || "Something went wrong";
//       });
//   },
// });

// export const { clearSellerState } = sellerSlice.actions;
// export default sellerSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios.utils";

/* =====================================================
   REGISTER SELLER (EXISTING)
===================================================== */
export const registerSeller = createAsyncThunk(
  "seller/registerSeller",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/register", sellerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Server error" }
      );
    }
  }
);

/* =====================================================
   FETCH SELLER PROFILE
===================================================== */
export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/seller/profile");
      return res.data.seller;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller"
      );
    }
  }
);

/* =====================================================
   UPDATE SELLER PROFILE (FORMDATA + PHOTO)
===================================================== */
export const updateSellerProfile = createAsyncThunk(
  "seller/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put("/seller/profileupdate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.seller;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */
const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
    token: null,
    loading: false, // for register & fetch
    updating: false, // for profile update
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSellerState: (state) => {
      state.seller = null;
      state.token = null;
      state.loading = false;
      state.updating = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= REGISTER ================= */
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload.seller;
        state.token = action.payload.token;
        state.successMessage = action.payload.message;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      /* ================= FETCH PROFILE ================= */
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE PROFILE ================= */
      .addCase(updateSellerProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.seller = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
