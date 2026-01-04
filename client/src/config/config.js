const config = {
  // API URL from environment variable with fallback
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // Feature flags
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true',
    enablePerformanceMonitoring: process.env.REACT_APP_ENABLE_PERFORMANCE === 'true',
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [8, 12, 24, 48],
  },
  
  // Upload limits
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  },
  
  // Cache settings
  cache: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Rate limiting
  rateLimit: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },
};

export default config;
