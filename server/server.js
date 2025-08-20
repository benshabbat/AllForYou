import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import recipeRoutes from './api/routes/recipeRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import allergenRoutes from './api/routes/allergenRoutes.js';
import tipRoutes from './api/routes/tipRoutes.js';
// import forumRoutes from './api/routes/forumRoutes.js';
// import productRoutes from './api/routes/products.js';
import { handleError } from './utils/errorHandler.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/allergens', allergenRoutes);
app.use('/api/tips', tipRoutes);
// app.use('/api/forum', forumRoutes);
// app.use('/api/products', productRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use((err, req, res, next) => {
  handleError(err, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;