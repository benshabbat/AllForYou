import { loadUser, setInitialized } from '../store/auth/authSlice';
import api from '../services/api';

export const initializeAuth = async (dispatch, queryClient) => {
  try {
    if (localStorage.getItem('token')) {
      console.log('Token found in localStorage, loading user...');
      await dispatch(loadUser()).unwrap();
    } else {
      console.log('No token found in localStorage');
    }
  } catch (error) {
    console.error('Error during authentication initialization:', error);
    localStorage.removeItem('token');
  } finally {
    dispatch(setInitialized());
    queryClient.prefetchQuery('allergens', api.getAllAllergens);
  }
};