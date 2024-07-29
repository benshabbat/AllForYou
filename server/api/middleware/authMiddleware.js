import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;

  try {
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies (if using cookie-based auth)
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    if (!token) {
      logger.warn('No token provided for protected route');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        logger.warn(`User not found for token: ${token}`);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Check if user's password has changed after token was issued
      if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
        logger.warn(`Password changed after token issued for user: ${user._id}`);
        return res.status(401).json({ message: 'User recently changed password! Please log in again.' });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    logger.error(`Error in auth middleware: ${error.message}`);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  try {
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // If no token, just move to the next middleware
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id
      const user = await User.findById(decoded.id).select('-password');

      if (user) {
        // If user found, add to request object
        req.user = user;
      }
    } catch (error) {
      // If token verification fails, log it but don't stop the request
      logger.warn(`Optional auth token verification failed: ${error.message}`);
    }

    next();
  } catch (error) {
    logger.error(`Error in optional auth middleware: ${error.message}`);
    next();
  }
};

// Middleware to check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.error('User object not found in request for role check');
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(`User ${req.user._id} attempted to access unauthorized route`);
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

// Optional: Middleware to refresh token
export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next();
    }

    // Generate new access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Set new access token in cookie or send in response
    res.cookie('token', accessToken, { httpOnly: true });
    // or
    // res.locals.newAccessToken = accessToken;

    next();
  } catch (error) {
    logger.error(`Error refreshing token: ${error.message}`);
    next();
  }
};