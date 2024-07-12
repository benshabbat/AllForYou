import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

const initialState = {
  userRecipes: [],
  favorites: [],
  isLoading: false,
  error: null,
};

// API functions for use with React Query
export const fetchRecipes = async ({ page = 1, limit = 12, searchTerm = '', allergens = [], category = '' }) => {
  try {
    const response = await api.get('/recipes', {
      params: { page, limit, searchTerm, allergens: allergens.join(','), category }
    });
    console.log('Fetched recipes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return thunkAPI.rejectWithValue('Failed to fetch recipe. Please try again later.');
    }
  }
);

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

export const fetchUserRecipes = async (userId) => {
  try {
    const response = await api.get(`/recipes/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return []; // Return an empty array in case of error
  }
};

export const rateRecipe = async ({ recipeId, rating }) => {
  const response = await api.post(`/recipes/${recipeId}/rate`, { rating });
  return response.data;
};

export const addComment = async ({ recipeId, content }) => {
  const response = await api.post(`/recipes/${recipeId}/comments`, { content });
  return response.data;
};

// Async Thunks
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