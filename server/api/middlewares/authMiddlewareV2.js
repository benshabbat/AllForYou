import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
import User from '../../models/User.js';
import logger from '../../utils/logger.js';

// JWT tokens management
export class TokenManager {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });

    const refreshToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpire,
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token, isRefreshToken = false) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided or invalid format');
    }
    return authHeader.split(' ')[1];
  }
}

// Main authentication middleware
export const protect = async (req, res, next) => {
  try {
    const token = TokenManager.extractTokenFromHeader(req.headers.authorization);
    const decoded = TokenManager.verifyToken(token);

    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      logger.warn(`Authentication failed: User not found for token ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user account is active
    if (user.status === 'inactive') {
      logger.warn(`Authentication failed: Inactive user ${user._id}`);
      return res.status(401).json({ message: 'Account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    
    if (error.message === 'Token expired') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Optional authentication middleware
export const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = TokenManager.extractTokenFromHeader(req.headers.authorization);
      const decoded = TokenManager.verifyToken(token);
      
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user && user.status === 'active') {
        req.user = user;
      }
    }
  } catch (error) {
    // In optional auth, we don't fail the request if token is invalid
    logger.debug(`Optional auth failed: ${error.message}`);
  }
  
  next();
};

// Refresh token middleware
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = TokenManager.verifyToken(refreshToken, true);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      logger.warn(`Refresh token validation failed for user ${decoded.id}`);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (user.status === 'inactive') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Generate new tokens
    const tokens = TokenManager.generateTokens({ id: user._id });
    
    // Update refresh token in database
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      message: 'Tokens refreshed successfully',
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    return res.status(401).json({ message: 'Token refresh failed' });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Authorization failed: User ${req.user._id} with role ${req.user.role} tried to access ${roles.join(', ')} endpoint`);
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Check if user owns resource
export const checkOwnership = (resourceModel, resourceParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if user is the owner or has admin role
      if (resource.createdBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        logger.warn(`Ownership check failed: User ${req.user._id} tried to access resource ${resourceId}`);
        return res.status(403).json({ message: 'Access denied: Not the owner' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      logger.error(`Ownership check error: ${error.message}`);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};