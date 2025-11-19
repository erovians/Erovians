import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.utils";

// LIST
export const fetchMembers = createAsyncThunk(
  "team/fetchMembers",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/team/getteammember");
      return res.data.members;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

// ADD
export const createMember = createAsyncThunk(
  "team/createMember",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/team/addteammember", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.member;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add member"
      );
    }
  }
);

// UPDATE
export const updateMember = createAsyncThunk(
  "team/updateMember",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/team/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.member;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update member"
      );
    }
  }
);

// DELETE
export const deleteMember = createAsyncThunk(
  "team/deleteMember",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/team/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete member");
    }
  }
);

/* -------------------------------------------
   🧠 SLICE
-------------------------------------------- */

const teamSlice = createSlice({
  name: "team",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* LIST */
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(createMember.fulfilled, (state, action) => {
        state.members.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(updateMember.fulfilled, (state, action) => {
        state.members = state.members.map((m) =>
          m._id === action.payload._id ? action.payload : m
        );
      })

      /* DELETE */
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m._id !== action.payload);
      });
  },
});

export default teamSlice.reducer;
