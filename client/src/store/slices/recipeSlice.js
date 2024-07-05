import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

// AsyncThunk לקבלת כל המתכונים
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async ({ searchTerm = "", allergen = "" }, thunkAPI) => {
    try {
      const response = await api.get("/recipes", {
        params: { searchTerm, allergen },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
// יצירת מתכון חדש
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

// עדכון מתכון קיים
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

// מחיקת מתכון
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

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    recipes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes.push(action.payload);
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe._id === action.payload._id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(
          (recipe) => recipe._id !== action.payload
        );
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.currentRecipe = action.payload;
      });
  },
});

export default recipeSlice.reducer;
