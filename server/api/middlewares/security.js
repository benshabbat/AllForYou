import crypto from 'crypto';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';

// CSRF Token Manager
export class CSRFTokenManager {
  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static verifyToken(sessionToken, requestToken) {
    if (!sessionToken || !requestToken) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(sessionToken, 'hex'),
      Buffer.from(requestToken, 'hex')
    );
  }
}

// CSRF Protection Middleware
export const csrfProtection = () => {
  return (req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip CSRF for API requests with valid JWT (stateless)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return next();
    }

    try {
      const sessionToken = req.session?.csrfToken;
      const requestToken = req.headers['x-csrf-token'] || req.body.csrfToken;

      if (!CSRFTokenManager.verifyToken(sessionToken, requestToken)) {
        logger.warn(`CSRF token validation failed for IP: ${req.ip}`);
        return res.status(403).json({ 
          message: 'CSRF token validation failed',
          code: 'CSRF_INVALID'
        });
      }

      next();
    } catch (error) {
      logger.error('CSRF protection error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

// Endpoint to get CSRF token
export const getCSRFToken = (req, res) => {
  const token = CSRFTokenManager.generateToken();
  
  // Store token in session if using sessions
  if (req.session) {
    req.session.csrfToken = token;
  }

  res.json({ csrfToken: token });
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Feature Policy / Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Strict Transport Security (only in production with HTTPS)
  if (config.NODE_ENV === 'production' && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

// Request ID middleware for tracking
export const requestId = (req, res, next) => {
  const id = crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  
  // Add to logger context
  req.logger = logger.child({ requestId: id });
  
  next();
};

// IP-based rate limiting (for specific endpoints)
export const createIPRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const store = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, data] of store.entries()) {
      if (data.firstRequest < windowStart) {
        store.delete(key);
      }
    }

    const ipData = store.get(ip) || { count: 0, firstRequest: now };

    if (ipData.firstRequest < windowStart) {
      // Reset counter for new window
      ipData.count = 1;
      ipData.firstRequest = now;
    } else {
      ipData.count++;
    }

    store.set(ip, ipData);

    if (ipData.count > maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        message: 'Too many requests',
        retryAfter: Math.ceil((ipData.firstRequest + windowMs - now) / 1000)
      });
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - ipData.count));
    res.setHeader('X-RateLimit-Reset', new Date(ipData.firstRequest + windowMs).toISOString());

    next();
  };
};

// User-based rate limiting (for authenticated users)
export const createUserRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 200) => {
  const store = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, data] of store.entries()) {
      if (data.firstRequest < windowStart) {
        store.delete(key);
      }
    }

    const userData = store.get(userId) || { count: 0, firstRequest: now };

    if (userData.firstRequest < windowStart) {
      userData.count = 1;
      userData.firstRequest = now;
    } else {
      userData.count++;
    }

    store.set(userId, userData);

    if (userData.count > maxRequests) {
      logger.warn(`User rate limit exceeded for user: ${userId}`);
      return res.status(429).json({
        message: 'Too many requests',
        retryAfter: Math.ceil((userData.firstRequest + windowMs - now) / 1000)
      });
    }

    next();
  };
};