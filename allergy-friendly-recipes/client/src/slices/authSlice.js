import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
  const response = await api.post('/users/login', userData);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;