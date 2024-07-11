import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

const initialState = {
  userRecipes: [],
  favorites: [],
  isLoading: false,
  error: null,
};

// פונקציות API לשימוש עם React Query
export const fetchRecipes = async ({ page = 1, limit = 12, searchTerm = '', allergens = [], category = '' }) => {
  const response = await api.get('/recipes', {
    params: { page, limit, searchTerm, allergens: allergens.join(','), category }
  });
  return response.data;
};

export const fetchRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const fetchComments = async (recipeId) => {
  try {
    const response = await api.get(`/recipes/${recipeId}/comments`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

// Async Thunks
export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, thunkAPI) => {
    try {
      const response = await api.post('/recipes', recipeData);
      toast.success('המתכון נוסף בהצלחה');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בהוספת המתכון');
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, thunkAPI) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      toast.success('המתכון עודכן בהצלחה');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון המתכון');
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('המתכון נמחק בהצלחה');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה במחיקת המתכון');
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

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.userRecipes.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.userRecipes.findIndex(recipe => recipe._id === action.payload._id);
        if (index !== -1) {
          state.userRecipes[index] = action.payload;
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.userRecipes = state.userRecipes.filter(recipe => recipe._id !== action.payload);
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