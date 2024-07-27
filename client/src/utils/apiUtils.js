import api from '../services/api';

// Recipe related API calls
export const fetchRecipes = async (params) => {
  const response = await api.get('/recipes', { params });
  return response.data;
};

export const fetchRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await api.post('/recipes', recipeData);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/recipes/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  await api.delete(`/recipes/${id}`);
};

export const rateRecipe = async (id, rating) => {
  const response = await api.post(`/recipes/${id}/rate`, { rating });
  return response.data;
};

// User related API calls
export const fetchUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const fetchUserRecipes = async (userId) => {
  const response = await api.get(`/recipes/user/${userId}`);
  return response.data;
};

// Allergen related API calls
export const fetchAllergens = async () => {
  const response = await api.get('/allergens');
  return response.data;
};

// Forum related API calls
export const fetchForumTopics = async (page = 1) => {
  const response = await api.get(`/forum/topics?page=${page}`);
  return response.data;
};

export const createForumTopic = async (topicData) => {
  const response = await api.post('/forum/topics', topicData);
  return response.data;
};

export const fetchForumTopic = async (topicId) => {
  const response = await api.get(`/forum/topics/${topicId}`);
  return response.data;
};

// Product related API calls
export const fetchProductByBarcode = async (barcode) => {
  try {
    const response = await api.get(`/products/${barcode}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};