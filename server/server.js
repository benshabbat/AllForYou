import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';
import allergenRoutes from './routes/allergens.js';
import { connectDB } from './config/db.js';
import logger from './utils/logger.js';
import { loginLimiter, apiLimiter } from './middleware/rateLimiter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/products.js';
import forumRoutes from './routes/forumRoutes.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('/uploads', (req, res, next) => {
  console.log('Requested file:', req.url);
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use('/api/users/login', loginLimiter);
app.use('/api', apiLimiter);

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/allergens', allergenRoutes);
app.use('/api/products', productRoutes);
app.use('/api/forum', forumRoutes);

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({ 
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

export default server;