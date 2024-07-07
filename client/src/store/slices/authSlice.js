import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

// אסינכרוני: הרשמת משתמש חדש
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/users/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'שגיאה בהרשמה');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בהרשמה');
    }
  }
);

// אסינכרוני: התחברות משתמש
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/users/login', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'שגיאה בהתחברות');
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בהתחברות');
    }
  }
);

// אסינכרוני: טעינת פרטי המשתמש המחובר
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Load user error:', error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת פרטי משתמש');
    }
  }
);

// יצירת ה-slice עבור אימות
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
  },
  reducers: {
    // התנתקות משתמש
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    },
    // ניקוי שגיאות
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // טיפול במצבי הרשמה
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // טיפול במצבי התחברות
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // טיפול בטעינת פרטי משתמש
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;