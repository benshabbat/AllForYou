import { createSlice } from '@reduxjs/toolkit';
import { apiUtils } from '../../utils/apiUtils';

const createAsyncThunk = (typePrefix, payloadCreator) => {
  return createAsyncThunk(typePrefix, async (arg, thunkAPI) => {
    try {
      return await payloadCreator(arg);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || `Error in ${typePrefix}`);
    }
  });
};

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', apiUtils.fetchRecipes);
export const fetchRecipeById = createAsyncThunk('recipes/fetchRecipeById', apiUtils.fetchRecipeById);
export const createRecipe = createAsyncThunk('recipes/createRecipe', apiUtils.createRecipe);
export const updateRecipe = createAsyncThunk('recipes/updateRecipe', apiUtils.updateRecipe);
export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', apiUtils.deleteRecipe);
export const rateRecipe = createAsyncThunk('recipes/rateRecipe', apiUtils.rateRecipe);
export const toggleFavorite = createAsyncThunk('recipes/toggleFavorite', apiUtils.toggleFavoriteRecipe);
export const fetchUserRecipes = createAsyncThunk('recipes/fetchUserRecipes', apiUtils.fetchUserRecipes);

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

const createAsyncReducers = (builder, thunk, stateProp = 'recipes') => {
  builder
    .addCase(thunk.pending, (state) => {
      state[stateProp].isLoading = true;
      state[stateProp].error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[stateProp].isLoading = false;
      state[stateProp].data = action.payload;
    })
    .addCase(thunk.rejected, (state, action) => {
      state[stateProp].isLoading = false;
      state[stateProp].error = action.payload;
    });
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
    createAsyncReducers(builder, fetchRecipes);
    createAsyncReducers(builder, fetchRecipeById, 'currentRecipe');
    createAsyncReducers(builder, createRecipe);
    createAsyncReducers(builder, updateRecipe, 'currentRecipe');
    
    builder
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