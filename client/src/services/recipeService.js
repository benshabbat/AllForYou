import api from '../api';

export const fetchRecipes = (params) => api.get('/recipes', { params });
export const fetchRecipeById = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (recipeData) => api.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => api.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const rateRecipe = (id, rating) => api.post(`/recipes/${id}/rate`, { rating });
export const toggleFavoriteRecipe = (id) => api.post(`/recipes/${id}/favorite`);