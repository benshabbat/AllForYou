import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipeReducer from './slices/recipeSlice';

// יצירת ה-store הראשי של האפליקציה
export const store = configureStore({
  reducer: {
    auth: authReducer,    // reducer לניהול מצב האימות
    recipes: recipeReducer, // reducer לניהול מצב המתכונים
    // ניתן להוסיף reducers נוספים כאן בעתיד
  },
  // ניתן להוסיף כאן middleware נוספים או הגדרות אחרות של Store
});

// טיפוס RootState המייצג את מבנה ה-state הכולל של האפליקציה
export type RootState = ReturnType<typeof store.getState>;

// טיפוס AppDispatch המייצג את הדיספאטצ'ר של האפליקציה
export type AppDispatch = typeof store.dispatch;