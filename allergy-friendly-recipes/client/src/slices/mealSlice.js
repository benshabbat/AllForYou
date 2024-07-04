import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch meals
export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (params) => {
  const { search, sort } = params || {};
  const response = await axios.get('/api/meals', {
    params: { search, sort }
  });
  return response.data;
});

// Async thunk to add a new meal
export const addMeal = createAsyncThunk('meals/addMeal', async (mealData) => {
  const response = await axios.post('/api/meals', mealData);
  return response.data;
});

const mealSlice = createSlice({
  name: 'meals',
  initialState: {
    meals: [],
    status: 'idle',
    error: null,
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
      .addCase(fetchMeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addMeal.fulfilled, (state, action) => {
        state.meals.push(action.payload);
      });
  },
});

export default mealSlice.reducer;