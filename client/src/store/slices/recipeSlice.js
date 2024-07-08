import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

// מצב התחלתי של ה-slice
const initialState = {
  recipes: [],
  totalRecipes: 0,
  userRecipes: [],
  favorites: [],
  currentRecipe: null,
  isLoading: false,
  error: null,
};

// פונקציית עזר לטיפול בשגיאות
const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  toast.error(errorMessage);
  return errorMessage;
};

// אסינכרוניות Thunk פעולות

// טעינת כל המתכונים עם אפשרויות סינון
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page = 1, limit = 12, searchTerm = '', allergens = [], category = '' }, thunkAPI) => {
    try {
      console.log('Fetching recipes with params:', { page, limit, searchTerm, allergens, category });
      const response = await api.get('/recipes', {
        params: { page, limit, searchTerm, allergens: allergens.join(','), category }
      });
      console.log('Fetched recipes:', response.data);
      return { recipes: response.data, totalRecipes: response.data.length };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת המתכונים');
    }
  }
);

// פעולה אסינכרונית חדשה לשליפת מתכוני המשתמש
export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (userId, thunkAPI) => {
    if (!userId) {
      return thunkAPI.rejectWithValue('מזהה משתמש לא תקין');
    }
    try {
      const response = await api.get(`/recipes/user/${userId}`);
      console.log('User recipes fetched:', response.data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בטעינת המתכונים';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
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

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'שגיאה בטעינת המתכון';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const toggleFavorite = createAsyncThunk(
  'recipes/toggleFavorite',
  async (recipeId, thunkAPI) => {
    try {
      const response = await api.post(`/recipes/${recipeId}/favorite`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון מועדפים');
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
        console.log('Fetching recipes: fulfilled', action.payload);
        state.isLoading = false;
        state.recipes = action.payload.recipes;
        state.totalRecipes = action.payload.totalRecipes;
        state.error = null;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        console.log('Fetching recipes: rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      // מקרים חדשים עבור fetchUserRecipes
      .addCase(fetchUserRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRecipes = action.payload;
        console.log('User recipes updated in state:', state.userRecipes);
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
      }).addCase(fetchRecipeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })      
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const index = state.favorites.indexOf(action.payload);
        if (index > -1) {
          state.favorites.splice(index, 1);
        } else {
          state.favorites.push(action.payload);
        }
      });
  },
});

export default recipeSlice.reducer;