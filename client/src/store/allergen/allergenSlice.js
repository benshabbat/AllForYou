import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAllergens = createAsyncThunk(
  'allergens/fetchAllergens',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/allergens');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch allergens');
    }
  }
);

const allergenSlice = createSlice({
  name: 'allergens',
  initialState: {
    allergens: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllergens.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllergens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allergens = action.payload;
      })
      .addCase(fetchAllergens.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default allergenSlice.reducer;