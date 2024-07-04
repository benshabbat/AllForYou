import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// פעולה אסינכרונית לקבלת תפריטים מהשרת
export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (params) => {
  const { allergy } = params || {};
  const response = await api.get('/meals', {
    params: { allergy },
  });
  return response.data;
});
const mealSlice = createSlice({
  name: 'meals',
  initialState: {
    meals: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.meals = action.payload;
      })
      .addCase(fetchMeals.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default mealSlice.reducer;