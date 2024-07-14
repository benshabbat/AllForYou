import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const updateUserAllergenPreferences = createAsyncThunk(
  'user/updateAllergenPreferences',
  async (allergenPreferences, thunkAPI) => {
    try {
      const response = await api.put('/users/allergen-preferences', { allergenPreferences });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון העדפות אלרגנים');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    allergenPreferences: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserAllergenPreferences.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserAllergenPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allergenPreferences = action.payload.allergenPreferences;
      })
      .addCase(updateUserAllergenPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;