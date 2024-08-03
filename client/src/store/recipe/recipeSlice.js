import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUtils } from '../../utils/apiUtils';

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async (_, thunkAPI) => {
  try {
    return await apiUtils.fetchRecipes();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching recipes');
  }
});

export const fetchRecipeById = createAsyncThunk('recipes/fetchRecipeById', async (id, thunkAPI) => {
  try {
    return await apiUtils.fetchRecipeById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching recipe');
  }
});

export const createRecipe = createAsyncThunk('recipes/createRecipe', async (recipeData, thunkAPI) => {
  try {
    return await apiUtils.createRecipe(recipeData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error creating recipe');
  }
});

export const updateRecipe = createAsyncThunk('recipes/updateRecipe', async ({ id, recipeData }, thunkAPI) => {
  try {
    return await apiUtils.updateRecipe(id, recipeData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error updating recipe');
  }
});

export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', async (id, thunkAPI) => {
  try {
    await apiUtils.deleteRecipe(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error deleting recipe');
  }
});

export const rateRecipe = createAsyncThunk('recipes/rateRecipe', async ({ id, rating }, thunkAPI) => {
  try {
    return await apiUtils.rateRecipe(id, rating);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error rating recipe');
  }
});

export const toggleFavorite = createAsyncThunk('recipes/toggleFavorite', async (id, thunkAPI) => {
  try {
    return await apiUtils.toggleFavoriteRecipe(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error toggling favorite');
  }
});

export const fetchUserRecipes = createAsyncThunk('recipes/fetchUserRecipes', async (userId, thunkAPI) => {
  try {
    return await apiUtils.fetchUserRecipes(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching user recipes');
  }
});

const initialState = {
  recipes: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentRecipe: {
    data: null,
    isLoading: false,
    error: null,
  },
  favorites: [],
  userRecipes: [],
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    resetError: (state) => {
      state.recipes.error = null;
      state.currentRecipe.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.recipes.isLoading = true;
        state.recipes.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipes.isLoading = false;
        state.recipes.data = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.recipes.isLoading = false;
        state.recipes.error = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.currentRecipe.isLoading = true;
        state.currentRecipe.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.currentRecipe.isLoading = false;
        state.currentRecipe.data = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.currentRecipe.isLoading = false;
        state.currentRecipe.error = action.payload;
      })
      // Add similar cases for other async thunks...
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes.data = state.recipes.data.filter(recipe => recipe.id !== action.payload);
      })
      .addCase(rateRecipe.fulfilled, (state, action) => {
        if (state.currentRecipe.data && state.currentRecipe.data.id === action.payload.id) {
          state.currentRecipe.data.rating = action.payload.rating;
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const index = state.favorites.indexOf(action.payload);
        if (index > -1) {
          state.favorites.splice(index, 1);
        } else {
          state.favorites.push(action.payload);
        }
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.userRecipes = action.payload;
      });
  },
});

export const { resetError } = recipeSlice.actions;
export default recipeSlice.reducer;