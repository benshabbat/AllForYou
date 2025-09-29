import { body, validationResult, matchedData } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import logger from '../../utils/logger.js';

// Input sanitization utilities
export class InputSanitizer {
  // Remove potential XSS attacks
  static sanitizeHtml(input) {
    if (typeof input !== 'string') return input;
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  // Remove SQL injection patterns (basic protection)
  static sanitizeSql(input) {
    if (typeof input !== 'string') return input;
    const sqlPatterns = /('|("|;|\*|%|<|>|\?|`|\\|\(|\)|\[|\]|\{|\}|\||&|!|=|\+|-|~|\^|#|@|\$))/gi;
    return input.replace(sqlPatterns, '');
  }

  // Sanitize object recursively
  static sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return this.sanitizeHtml(obj);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        sanitized[key] = value.map(item => this.sanitizeObject(item));
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = this.sanitizeHtml(value);
      }
    }
    return sanitized;
  }

  // Normalize and trim strings
  static normalizeString(str) {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/\s+/g, ' ');
  }
}

// Middleware to sanitize request body
export const sanitizeInput = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = InputSanitizer.sanitizeObject(req.body);
    }

    if (req.query && typeof req.query === 'object') {
      req.query = InputSanitizer.sanitizeObject(req.query);
    }

    if (req.params && typeof req.params === 'object') {
      req.params = InputSanitizer.sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    logger.error('Input sanitization error:', error);
    return res.status(400).json({ message: 'Invalid input format' });
  }
};

// Validation middleware factory
export const validate = (validationRules) => {
  return async (req, res, next) => {
    // Run validation rules
    await Promise.all(validationRules.map(rule => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract only validated data
    req.validatedData = matchedData(req);
    next();
  };
};

// Common validation rules
export const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  password: body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'),

  username: body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters long and contain only letters, numbers, and underscores'),

  id: body('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  text: (field, min = 1, max = 1000) => 
    body(field)
      .isLength({ min, max })
      .trim()
      .escape()
      .withMessage(`${field} must be between ${min} and ${max} characters`),

  number: (field, min = 0, max = Number.MAX_SAFE_INTEGER) =>
    body(field)
      .isNumeric()
      .custom(value => {
        const num = Number(value);
        if (num < min || num > max) {
          throw new Error(`${field} must be between ${min} and ${max}`);
        }
        return true;
      }),

  array: (field, itemValidation) =>
    body(field)
      .isArray()
      .custom((array) => {
        if (array.length === 0) {
          throw new Error(`${field} must not be empty`);
        }
        return true;
      }),

  url: body('url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),

  boolean: (field) =>
    body(field)
      .isBoolean()
      .withMessage(`${field} must be a boolean value`)
};