import api from '../services/api';



const extractData = (response) => response.data;


const apiCall = async (method, endpoint, data = null, params = null) => {
  const config = { params };
  const response = await api[method](endpoint, data, config);
  return extractData(response);
};

// Recipe related API calls
export const fetchRecipes = (params) => apiCall('get', '/recipes', null, params);
export const createRecipe = (recipeData) => apiCall('post', '/recipes', recipeData);
export const fetchRecipeById = (id) => apiCall('get', `/recipes/${id}`);
export const updateRecipe = (id,recipeData) => apiCall('put', `/recipes/${id}`, recipeData);




export const deleteRecipe = async (id) => {
  await api.delete(`/recipes/${id}`);
};

export const rateRecipe = async (id, rating) => {
  const response = await api.post(`/recipes/${id}/rate`, { rating });
  return extractData(response);
};

export const toggleFavoriteRecipe = async (id) => {
  const response = await api.post(`/recipes/${id}/favorite`);
  return extractData(response);
};

// User related API calls
export const fetchUserProfile = async () => {
  const response = await api.get('/users/me');
  return extractData(response);
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return extractData(response);
};

export const fetchUserRecipes = async (userId) => {
  const response = await api.get(`/recipes/user/${userId}`);
  return extractData(response);
};

export const updateUserAllergenPreferences = async (allergens) => {
  const response = await api.put('/users/allergen-preferences', { allergens });
  return extractData(response);
};

export const fetchFavoriteRecipes = async () => {
  const response = await api.get('/users/favorites');
  return extractData(response);
};

export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return extractData(response);
};

export const login = async (userData) => {
  const response = await api.post('/users/login', userData);
  return extractData(response);
};

// Allergen related API calls
export const fetchAllergens = async () => {
  const response = await api.get('/allergens');
  return extractData(response);
};

// Forum related API calls
export const fetchForumTopics = async (page = 1) => {
  const response = await api.get(`/forum/topics?page=${page}`);
  return extractData(response);
};

export const createForumTopic = async (topicData) => {
  const response = await api.post('/forum/topics', topicData);
  return extractData(response);
};

export const fetchForumTopic = async (topicId) => {
  const response = await api.get(`/forum/topics/${topicId}`);
  return extractData(response);
};

export const deleteForumTopic = async (topicId) => {
  await api.delete(`/forum/topics/${topicId}`);
};

export const createForumReply = async (topicId, replyData) => {
  const response = await api.post(`/forum/topics/${topicId}/replies`, replyData);
  return extractData(response);
};

// Product related API calls
export const fetchProductByBarcode = async (barcode) => {
  try {
    const response = await api.get(`/products/${barcode}`);
    return extractData(response);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return extractData(response);
};

export const searchForumTopics = async (searchTerm, page = 1) => {
  const response = await api.get(`/forum/search?query=${searchTerm}&page=${page}`);
  return extractData(response);
};

export const addToScanHistory = async (productCode, productName) => {
  const response = await api.post('/users/scan-history', { productCode, productName });
  return extractData(response);
};

export const fetchScanHistory = async () => {
  const response = await api.get('/users/scan-history');
  return extractData(response);
};

// Comment related API calls
export const addComment = async (recipeId, commentData) => {
  const response = await api.post(`/recipes/${recipeId}/comments`, commentData);
  return extractData(response);
};

export const editComment = async (recipeId, commentId, commentData) => {
  const response = await api.put(`/recipes/${recipeId}/comments/${commentId}`, commentData);
  return extractData(response);
};

export const deleteComment = async (recipeId, commentId) => {
  await api.delete(`/recipes/${recipeId}/comments/${commentId}`);
};