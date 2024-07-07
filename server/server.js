import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger for development use
app.use(helmet()); // Set various HTTP headers for improved security

// Routes
app.use('/api/recipes', recipeRoutes); // Mount recipe-related routes
app.use('/api/users', userRoutes); // Mount user-related routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));