// API Documentation
// This file contains the complete API interface for the AllForYou application

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: (credentials) => api.post('/users/login', credentials),

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<{token: string, user: Object}>}
   */
  register: (userData) => api.post('/users/register', userData),

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getProfile: () => api.get('/users/profile'),

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user
   */
  updateProfile: (updates) => api.put('/users/profile', updates),
};

/**
 * Recipe API
 */
export const recipeAPI = {
  /**
   * Get all recipes with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @param {string[]} params.allergens - Allergen IDs to exclude
   * @param {string} params.category - Recipe category
   * @param {string} params.difficulty - Recipe difficulty level
   * @returns {Promise<{recipes: Array, totalPages: number, currentPage: number}>}
   */
  getAll: (params) => api.get('/recipes', { params }),

  /**
   * Get recipe by ID
   * @param {string} id - Recipe ID
   * @returns {Promise<Object>} Recipe details
   */
  getById: (id) => api.get(`/recipes/${id}`),

  /**
   * Create new recipe
   * @param {Object} recipeData - Recipe data
   * @returns {Promise<Object>} Created recipe
   */
  create: (recipeData) => api.post('/recipes', recipeData),

  /**
   * Update recipe
   * @param {string} id - Recipe ID
   * @param {Object} updates - Recipe updates
   * @returns {Promise<Object>} Updated recipe
   */
  update: (id, updates) => api.put(`/recipes/${id}`, updates),

  /**
   * Delete recipe
   * @param {string} id - Recipe ID
   * @returns {Promise<void>}
   */
  delete: (id) => api.delete(`/recipes/${id}`),

  /**
   * Add recipe rating
   * @param {string} id - Recipe ID
   * @param {Object} rating - Rating data
   * @param {number} rating.rating - Rating value (1-5)
   * @param {string} rating.comment - Optional comment
   * @returns {Promise<Object>} Updated recipe
   */
  addRating: (id, rating) => api.post(`/recipes/${id}/ratings`, rating),
};

/**
 * Allergen API
 */
export const allergenAPI = {
  /**
   * Get all allergens
   * @returns {Promise<Array>} List of allergens
   */
  getAll: () => api.get('/allergens'),

  /**
   * Get allergens by IDs
   * @param {string[]} ids - Array of allergen IDs
   * @returns {Promise<Array>} List of allergens
   */
  getByIds: (ids) => api.get('/allergens/byIds', { params: { ids: ids.join(',') } }),
};

/**
 * Forum API
 */
export const forumAPI = {
  /**
   * Get forum topics
   * @param {number} page - Page number
   * @returns {Promise<{topics: Array, currentPage: number, totalPages: number}>}
   */
  getTopics: (page = 1) => api.get(`/forum/topics?page=${page}`),

  /**
   * Search forum topics
   * @param {string} searchTerm - Search term
   * @param {number} page - Page number
   * @returns {Promise<{topics: Array, currentPage: number, totalPages: number}>}
   */
  searchTopics: (searchTerm, page = 1) => 
    api.get(`/forum/search?query=${searchTerm}&page=${page}`),

  /**
   * Get topic by ID
   * @param {string} topicId - Topic ID
   * @returns {Promise<Object>} Topic details
   */
  getTopic: (topicId) => api.get(`/forum/topics/${topicId}`),

  /**
   * Create new topic
   * @param {Object} topicData - Topic data
   * @param {string} topicData.title - Topic title
   * @param {string} topicData.content - Topic content
   * @returns {Promise<Object>} Created topic
   */
  createTopic: (topicData) => api.post('/forum/topics', topicData),

  /**
   * Delete topic
   * @param {string} topicId - Topic ID
   * @returns {Promise<void>}
   */
  deleteTopic: (topicId) => api.delete(`/forum/topics/${topicId}`),

  /**
   * Create reply to topic
   * @param {string} topicId - Topic ID
   * @param {Object} replyData - Reply data
   * @param {string} replyData.content - Reply content
   * @returns {Promise<Object>} Created reply
   */
  createReply: (topicId, replyData) => 
    api.post(`/forum/topics/${topicId}/replies`, replyData),
};

/**
 * Product API
 */
export const productAPI = {
  /**
   * Get product by barcode
   * @param {string} barcode - Product barcode
   * @returns {Promise<Object>} Product details
   */
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  create: (productData) => api.post('/products', productData),
};

/**
 * User API
 */
export const userAPI = {
  /**
   * Add recipe to favorites
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} Updated user
   */
  addFavorite: (recipeId) => api.post(`/users/favorites/${recipeId}`),

  /**
   * Remove recipe from favorites
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} Updated user
   */
  removeFavorite: (recipeId) => api.delete(`/users/favorites/${recipeId}`),

  /**
   * Get user's favorite recipes
   * @returns {Promise<Array>} List of favorite recipes
   */
  getFavorites: () => api.get('/users/favorites'),

  /**
   * Update user allergens
   * @param {string[]} allergenIds - Array of allergen IDs
   * @returns {Promise<Object>} Updated user
   */
  updateAllergens: (allergenIds) => 
    api.put('/users/allergens', { allergens: allergenIds }),
};
