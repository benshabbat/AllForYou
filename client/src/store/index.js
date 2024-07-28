import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import recipeReducer from './recipe/recipeSlice';
import allergenReducer from './allergen/allergenSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    allergens: allergenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;