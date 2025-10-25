// store/slices/certificatesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios.utils';

export const fetchCertificates = createAsyncThunk(
  'certificates/fetchCertificates',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/company/certificates');
      return res.data.certificates;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch certificates';
      });
  },
});

export default certificatesSlice.reducer;
