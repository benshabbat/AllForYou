/**
 * @file Security utilities and best practices
 * @module utils/security
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `הסיסמה חייבת להכיל לפחות ${minLength} תווים`,
    };
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      message: 'הסיסמה חייבת להכיל לפחות אות גדולה אחת',
    };
  }

  if (!hasLowerCase) {
    return {
      isValid: false,
      message: 'הסיסמה חייבת להכיל לפחות אות קטנה אחת',
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      message: 'הסיסמה חייבת להכיל לפחות ספרה אחת',
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'הסיסמה חייבת להכיל לפחות תו מיוחד אחד',
    };
  }

  return {
    isValid: true,
    message: 'הסיסמה חזקה',
  };
};

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export const generateSecureToken = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  if (typeof window !== 'undefined' && window.crypto) {
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      token += charset[randomValues[i] % charset.length];
    }
  } else {
    // Fallback for environments without crypto API
    for (let i = 0; i < length; i++) {
      token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  return token;
};

/**
 * Check if URL is safe (prevent open redirect attacks)
 * @param {string} url - URL to check
 * @param {string[]} allowedDomains - List of allowed domains
 * @returns {boolean} True if URL is safe
 */
export const isSafeUrl = (url, allowedDomains = []) => {
  try {
    const urlObj = new URL(url, window.location.origin);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // If it's a relative URL (same origin), it's safe
    if (urlObj.origin === window.location.origin) {
      return true;
    }

    // Check if domain is in allowed list
    if (allowedDomains.length > 0) {
      return allowedDomains.some((domain) => urlObj.hostname.endsWith(domain));
    }

    // By default, don't allow external URLs
    return false;
  } catch {
    return false;
  }
};

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
};

/**
 * Rate limiter for client-side operations
 * @param {Function} func - Function to rate limit
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Rate limited function
 */
export const rateLimit = (func, delay) => {
  let timeout = null;
  let lastRan = null;

  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          if (Date.now() - lastRan >= delay) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        delay - (Date.now() - lastRan)
      );
    }
  };
};

/**
 * Debounce function to prevent excessive calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Constant-time string comparison to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings match
 */
export const constantTimeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};
