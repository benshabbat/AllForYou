import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

const initialState = {
  userRecipes: [],
  favorites: [],
  isLoading: false,
  error: null,
};

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page = 1, limit = 12, searchTerm = '', allergens = [], category = '' }, thunkAPI) => {
    try {
      const response = await api.get('/recipes', {
        params: { page, limit, searchTerm, allergens: allergens.join(','), category }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
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
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }
);

export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/user/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch user recipes');
    }
  }
);
export const rateRecipe = createAsyncThunk(
  'recipes/rateRecipe',
  async ({ recipeId, rating }, thunkAPI) => {
    try {
      const response = await api.post(`/recipes/${recipeId}/rate`, { rating });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to rate recipe');
    }
  }
);

export const addComment = createAsyncThunk(
  'recipes/addComment',
  async ({ recipeId, content }, thunkAPI) => {
    try {
      const response = await api.post(`/recipes/${recipeId}/comments`, { content });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, thunkAPI) => {
    try {
      const response = await api.post('/recipes', recipeData);
      toast.success('Recipe added successfully');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error adding recipe');
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, thunkAPI) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      toast.success('Recipe updated successfully');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error updating recipe');
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('Recipe deleted successfully');
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error deleting recipe');
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
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error updating favorites');
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRecipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        // Handle specific recipe update if needed
      })
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
      })
      .addCase(fetchUserRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRecipes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = recipeSlice.actions;

export default recipeSlice.reducer;