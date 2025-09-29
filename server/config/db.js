import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, config.database.options);
    
    logger.info(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
    
    return conn;
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};