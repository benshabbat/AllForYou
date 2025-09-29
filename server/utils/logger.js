import winston from 'winston';
import config from '../config/config.js';

const { combine, timestamp, json, colorize, simple, errors } = winston.format;

// Define log format
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// Create console format for development
const consoleFormat = combine(
  colorize(),
  simple(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'allforyou-api' },
  transports: [
    // Error log file - only errors
    new winston.transports.File({
      filename: config.logging.errorFile,
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Combined log file - all levels
    new winston.transports.File({
      filename: config.logging.combinedFile,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' })
  ]
});

// Add console transport in development
if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

export default logger;