import api from '../services/api';

// Constants for API paths
const API_PATHS = {
  RECIPES: '/recipes',
  USERS: '/users',
  FORUM: '/forum',
  PRODUCTS: '/products',
  ALLERGENS: '/allergens',
};

// Helper function to extract data from API response
const extractData = (response) => response.data;

// Helper function for making API calls
const apiCall = async (method, endpoint, data = null, params = null) => {
  try {
    const config = { params };
    const response = await api[method](endpoint, data, config);
    return extractData(response);
  } catch (error) {
    console.error(`API call failed: ${method} ${endpoint}`, error);
    throw error;
  }
};

// Recipe related functions
const recipeApi = {
  fetchRecipes: (params) => apiCall('get', API_PATHS.RECIPES, null, params),
  fetchRecipeById: (id) => apiCall('get', `${API_PATHS.RECIPES}/${id}`),
  createRecipe: (recipeData) => apiCall('post', API_PATHS.RECIPES, recipeData),
  updateRecipe: (id, recipeData) => apiCall('put', `${API_PATHS.RECIPES}/${id}`, recipeData),
  deleteRecipe: (id) => apiCall('delete', `${API_PATHS.RECIPES}/${id}`),
  rateRecipe: (id, rating) => apiCall('post', `${API_PATHS.RECIPES}/${id}/rate`, { rating }),
  toggleFavoriteRecipe: (id) => apiCall('post', `${API_PATHS.RECIPES}/${id}/favorite`),
  addComment: (recipeId, commentData) => apiCall('post', `${API_PATHS.RECIPES}/${recipeId}/comments`, commentData),
  editComment: (recipeId, commentId, commentData) => apiCall('put', `${API_PATHS.RECIPES}/${recipeId}/comments/${commentId}`, commentData),
  deleteComment: (recipeId, commentId) => apiCall('delete', `${API_PATHS.RECIPES}/${recipeId}/comments/${commentId}`),
};

// User related functions
const userApi = {
  fetchUserProfile: () => apiCall('get', `${API_PATHS.USERS}/me`),
  updateUserProfile: (userData) => apiCall('put', `${API_PATHS.USERS}/profile`, userData),
  fetchUserRecipes: (userId) => apiCall('get', `${API_PATHS.RECIPES}/user/${userId}`),
  updateUserAllergenPreferences: (allergens) => apiCall('put', `${API_PATHS.USERS}/allergen-preferences`, { allergens }),
  fetchFavoriteRecipes: () => apiCall('get', `${API_PATHS.USERS}/favorites`),
  register: (userData) => apiCall('post', `${API_PATHS.USERS}/register`, userData),
  login: (userData) => apiCall('post', `${API_PATHS.USERS}/login`, userData),
  addToScanHistory: (productCode, productName) => apiCall('post', `${API_PATHS.USERS}/scan-history`, { productCode, productName }),
  fetchScanHistory: () => apiCall('get', `${API_PATHS.USERS}/scan-history`),
  activityTimeline: (userId) => apiCall('get', `${API_PATHS.USERS}/${userId}/activities`),
  
};

// Allergen related functions
const allergenApi = {
  fetchAllergens: () => apiCall('get', API_PATHS.ALLERGENS),
};

// Forum related functions
const forumApi = {
  fetchForumTopics: (page = 1) => apiCall('get', `${API_PATHS.FORUM}/topics`, null, { page }),
  createForumTopic: (topicData) => apiCall('post', `${API_PATHS.FORUM}/topics`, topicData),
  fetchForumTopic: (topicId) => apiCall('get', `${API_PATHS.FORUM}/topics/${topicId}`),
  deleteForumTopic: (topicId) => apiCall('delete', `${API_PATHS.FORUM}/topics/${topicId}`),
  createForumReply: (topicId, replyData) => apiCall('post', `${API_PATHS.FORUM}/topics/${topicId}/replies`, replyData),
  searchForumTopics: (searchTerm, page = 1) => apiCall('get', `${API_PATHS.FORUM}/search`, null, { query: searchTerm, page }),
};

// Product related functions
const productApi = {
  fetchProductByBarcode: async (barcode) => {
    try {
      return await apiCall('get', `${API_PATHS.PRODUCTS}/${barcode}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
  createProduct: (productData) => apiCall('post', API_PATHS.PRODUCTS, productData),
};

// Export all API functions
export const apiUtils = {
  ...recipeApi,
  ...userApi,
  ...allergenApi,
  ...forumApi,
  ...productApi,
};