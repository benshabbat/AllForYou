import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipeReducer from './slices/recipeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    // הוסף reducers נוספים כאן אם יש
  },
});