import api from '../api';

export const fetchUserProfile = () => api.get('/users/me');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);
export const fetchUserRecipes = (userId) => api.get(`/recipes/user/${userId}`);
export const updateUserAllergenPreferences = (allergens) => api.put('/users/allergen-preferences', { allergens });
