import { configureStore } from '@reduxjs/toolkit';
import mealReducer from './slices/mealSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    meal: mealReducer,
    auth: authReducer,
  },
});