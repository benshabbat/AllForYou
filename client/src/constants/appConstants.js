/**
 * Application-wide constants
 * @module constants/app
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  ALLERGENS: 'selectedAllergens',
  RECENT_SEARCHES: 'recentSearches',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  LOGOUT: '/users/logout',
  PROFILE: '/users/profile',
  
  // Recipes
  RECIPES: '/recipes',
  RECIPE_BY_ID: (id) => `/recipes/${id}`,
  RECIPE_RATINGS: (id) => `/recipes/${id}/ratings`,
  
  // Allergens
  ALLERGENS: '/allergens',
  ALLERGENS_BY_IDS: '/allergens/byIds',
  
  // Forum
  FORUM_TOPICS: '/forum/topics',
  FORUM_TOPIC: (id) => `/forum/topics/${id}`,
  FORUM_REPLIES: (id) => `/forum/topics/${id}/replies`,
  FORUM_SEARCH: '/forum/search',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_BARCODE: (barcode) => `/products/barcode/${barcode}`,
  
  // User
  FAVORITES: '/users/favorites',
  FAVORITE_BY_ID: (id) => `/users/favorites/${id}`,
  USER_ALLERGENS: '/users/allergens',
};

// Query Keys for React Query
export const QUERY_KEYS = {
  RECIPES: 'recipes',
  RECIPE: 'recipe',
  ALLERGENS: 'allergens',
  FORUM_TOPICS: 'forumTopics',
  FORUM_TOPIC: 'forumTopic',
  USER_PROFILE: 'userProfile',
  FAVORITES: 'favorites',
  PRODUCTS: 'products',
  PRODUCT: 'product',
};

// Recipe Categories (Hebrew)
export const RECIPE_CATEGORIES = {
  APPETIZERS: 'מנות פתיחה',
  SOUPS: 'מרקים',
  SALADS: 'סלטים',
  MAIN_COURSES: 'מנות עיקריות',
  SIDE_DISHES: 'תוספות',
  DESSERTS: 'קינוחים',
  BEVERAGES: 'משקאות',
  BREAKFAST: 'ארוחת בוקר',
  SNACKS: 'חטיפים',
  BAKING: 'אפייה',
};

// Difficulty Levels (Hebrew)
export const DIFFICULTY_LEVELS = {
  EASY: 'קל',
  MEDIUM: 'בינוני',
  HARD: 'קשה',
};

// Recipe Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  RATING_HIGH: 'rating_high',
  RATING_LOW: 'rating_low',
  PREP_TIME: 'prep_time',
  NAME_A_Z: 'name_a_z',
  NAME_Z_A: 'name_z_a',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  ITEMS_PER_PAGE_OPTIONS: [8, 12, 24, 48],
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

// Validation Rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  RECIPE: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 1000,
    MIN_INGREDIENTS: 1,
    MIN_INSTRUCTIONS: 1,
  },
};

// Time Formats
export const TIME_FORMAT = {
  SHORT_DATE: 'DD/MM/YYYY',
  LONG_DATE: 'DD MMMM YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Error Messages (Hebrew)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'שגיאת רשת. אנא בדוק את החיבור לאינטרנט.',
  UNAUTHORIZED: 'אין הרשאה. אנא התחבר מחדש.',
  FORBIDDEN: 'אין לך הרשאה לבצע פעולה זו.',
  NOT_FOUND: 'המשאב המבוקש לא נמצא.',
  SERVER_ERROR: 'שגיאת שרת. אנא נסה שוב מאוחר יותר.',
  VALIDATION_ERROR: 'אנא תקן את השגיאות בטופס.',
  TIMEOUT: 'הבקשה ארכה זמן רב מדי. אנא נסה שוב.',
  GENERIC: 'אירעה שגיאה. אנא נסה שוב.',
};

// Success Messages (Hebrew)
export const SUCCESS_MESSAGES = {
  LOGIN: 'התחברת בהצלחה!',
  REGISTER: 'נרשמת בהצלחה!',
  LOGOUT: 'התנתקת בהצלחה.',
  RECIPE_CREATED: 'המתכון נוסף בהצלחה!',
  RECIPE_UPDATED: 'המתכון עודכן בהצלחה!',
  RECIPE_DELETED: 'המתכון נמחק בהצלחה.',
  PROFILE_UPDATED: 'הפרופיל עודכן בהצלחה!',
  FAVORITE_ADDED: 'המתכון נוסף למועדפים.',
  FAVORITE_REMOVED: 'המתכון הוסר מהמועדפים.',
  COMMENT_ADDED: 'התגובה נוספה בהצלחה!',
};

// Debounce/Throttle Times (milliseconds)
export const TIMING = {
  SEARCH_DEBOUNCE: 500,
  AUTOSAVE_DEBOUNCE: 2000,
  SCROLL_THROTTLE: 200,
  RESIZE_THROTTLE: 300,
};

// Breakpoints for responsive design (pixels)
export const BREAKPOINTS = {
  MOBILE: 320,
  MOBILE_L: 480,
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1280,
  WIDE: 1440,
};

// z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};

// Animation Durations (milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

export default {
  HTTP_STATUS,
  STORAGE_KEYS,
  API_ENDPOINTS,
  QUERY_KEYS,
  RECIPE_CATEGORIES,
  DIFFICULTY_LEVELS,
  SORT_OPTIONS,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION,
  TIME_FORMAT,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TIMING,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION,
};
