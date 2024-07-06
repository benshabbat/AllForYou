import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

// אסינכרוני: טעינת מתכונים
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page = 1, limit = 10, searchTerm = '', allergens = [], category = '' }, thunkAPI) => {
    try {
      const response = await api.get('/recipes', {
        params: { page, limit, searchTerm, allergens: allergens.join(','), category }
      });
      return response.data;
    } catch (error) {
      toast.error('שגיאה בטעינת המתכונים');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// אסינכרוני: טעינת מתכון בודד לפי מזהה
export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      toast.error('שגיאה בטעינת המתכון');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// אסינכרוני: הוספת מתכון חדש
export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, thunkAPI) => {
    try {
      const response = await api.post('/recipes', recipeData);
      toast.success('המתכון נוסף בהצלחה');
      return response.data;
    } catch (error) {
      toast.error('שגיאה בהוספת המתכון');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// אסינכרוני: עדכון מתכון קיים
export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, thunkAPI) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      toast.success('המתכון עודכן בהצלחה');
      return response.data;
    } catch (error) {
      toast.error('שגיאה בעדכון המתכון');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// אסינכרוני: מחיקת מתכון
export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('המתכון נמחק בהצלחה');
      return id;
    } catch (error) {
      toast.error('שגיאה במחיקת המתכון');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// אסינכרוני: דירוג מתכון
export const rateRecipe = createAsyncThunk(
  'recipes/rateRecipe',
  async ({ id, rating }, thunkAPI) => {
    try {
      const response = await api.post(`/recipes/${id}/rate`, { rating });
      toast.success('הדירוג נוסף בהצלחה');
      return response.data;
    } catch (error) {
      toast.error('שגיאה בהוספת הדירוג');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    totalRecipes: 0,
    currentRecipe: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // טיפול במצבים שונים של טעינת מתכונים
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
      // טיפול במצבים שונים של טעינת מתכון בודד
      .addCase(fetchRecipeById.pending, (state) => {
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
      // טיפול במצבים שונים של הוספת מתכון
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
      })
      // טיפול במצבים שונים של עדכון מתכון
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(recipe => recipe._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        if (state.currentRecipe && state.currentRecipe._id === action.payload._id) {
          state.currentRecipe = action.payload;
        }
      })
      // טיפול במצבים שונים של מחיקת מתכון
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload);
        if (state.currentRecipe && state.currentRecipe._id === action.payload) {
          state.currentRecipe = null;
        }
      })
      // טיפול במצבים שונים של דירוג מתכון
      .addCase(rateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(recipe => recipe._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index].rating = action.payload.rating;
          state.recipes[index].ratingCount = action.payload.ratingCount;
        }
        if (state.currentRecipe && state.currentRecipe._id === action.payload._id) {
          state.currentRecipe.rating = action.payload.rating;
          state.currentRecipe.ratingCount = action.payload.ratingCount;
        }
      });
  },
});

export const { clearCurrentRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;