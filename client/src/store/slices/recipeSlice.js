import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

// מצב התחלתי של ה-slice
const initialState = {
  recipes: [],          // מערך של כל המתכונים
  totalRecipes: 0,      // מספר כולל של מתכונים (לצורך עימוד)
  isLoading: false,     // האם יש טעינה כרגע
  error: null,          // הודעת שגיאה, אם קיימת
};

// פונקציית עזר לטיפול בשגיאות
const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  toast.error(errorMessage);
  return errorMessage;
};

// טעינת כל המתכונים עם אפשרויות סינון
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page = 1, limit = 10, searchTerm = '', allergens = [], category = '' }, thunkAPI) => {
    try {
      const response = await api.get('/recipes', {
        params: { page, limit, searchTerm, allergens: allergens.join(','), category }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'שגיאה בטעינת המתכונים'));
    }
  }
);

// טעינת מתכונים של משתמש ספציפי
export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/user/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'שגיאה בטעינת המתכונים של המשתמש'));
    }
  }
);

// הוספת מתכון חדש
export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, thunkAPI) => {
    try {
      const response = await api.post('/recipes', recipeData);
      toast.success('המתכון נוסף בהצלחה');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'שגיאה בהוספת המתכון'));
    }
  }
);

// עדכון מתכון קיים
export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, thunkAPI) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      toast.success('המתכון עודכן בהצלחה');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'שגיאה בעדכון המתכון'));
    }
  }
);

// מחיקת מתכון
export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('המתכון נמחק בהצלחה');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'שגיאה במחיקת המתכון'));
    }
  }
);

// דירוג מתכון
export const rateRecipe = createAsyncThunk(
  'recipes/rateRecipe',
  async ({ id, rating }, thunkAPI) => {
    try {
      const response = await api.post(`/recipes/${id}/rate`, { rating });
      toast.success('הדירוג נוסף בהצלחה');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'שגיאה בדירוג המתכון'));
    }
  }
);

// יצירת ה-slice
const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    // ניתן להוסיף כאן reducers סינכרוניים אם יש צורך
  },
  extraReducers: (builder) => {
    builder
      // טיפול בטעינת כל המתכונים
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload.recipes;
        state.totalRecipes = action.payload.totalRecipes;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // טיפול בטעינת מתכונים של משתמש ספציפי
      .addCase(fetchUserRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload;
        // שים לב: כאן לא מעדכנים את totalRecipes כי זה רק עבור משתמש ספציפי
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // טיפול בהוספת מתכון חדש
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
        state.totalRecipes++;
      })
      // טיפול בעדכון מתכון
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(recipe => recipe._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      // טיפול במחיקת מתכון
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload);
        state.totalRecipes--;
      })
      // טיפול בדירוג מתכון
      .addCase(rateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(recipe => recipe._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      });
  },
});

export default recipeSlice.reducer;