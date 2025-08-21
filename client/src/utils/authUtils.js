import { loadUser, setInitialized } from '../store/auth/authSlice';
import api from '../services/api';

export const initializeAuth = async (dispatch, queryClient) => {
  try {
    if (localStorage.getItem('token')) {
      await dispatch(loadUser()).unwrap();
    }
  } catch (error) {
    console.error('Error during authentication initialization:', error);
    localStorage.removeItem('token');
  } finally {
    dispatch(setInitialized());
    queryClient.prefetchQuery('allergens', api.getAllAllergens);
  }
};