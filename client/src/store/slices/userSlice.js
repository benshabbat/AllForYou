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

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון פרטי המשתמש');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בשינוי הסיסמה');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    allergenPreferences: [],
    profile: null,
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
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;