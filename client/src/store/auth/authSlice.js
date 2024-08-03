import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';
import { apiUtils } from '../../utils/apiUtils';
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await apiUtils.register(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration error');
  }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await apiUtils.login(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login error');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try {
    return await apiUtils.fetchUserProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Load user error');
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isInitialized: false,
  isAuthenticated: false,
};

const updateUserState = (state, action) => {
  state.isLoading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.error = null;
  localStorage.setItem('token', action.payload.token);
};

const handleAuthError = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
  state.isAuthenticated = false;
  state.user = null;
  state.token = null;
  localStorage.removeItem('token');
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isInitialized = true;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, updateUserState)
      .addCase(register.rejected, handleAuthError)
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, updateUserState)
      .addCase(login.rejected, handleAuthError)
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInitialized = true;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, handleAuthError);
  },
});

export const { logout, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;