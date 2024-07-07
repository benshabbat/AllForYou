import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';

// טעינת משתני סביבה מקובץ .env
dotenv.config();

// יצירת אפליקציית Express
const app = express();

// Middleware
app.use(cors()); // אפשור Cross-Origin Resource Sharing
app.use(express.json()); // פענוח גופי בקשות JSON
app.use(morgan('dev')); // לוגר של בקשות HTTP לפיתוח
app.use(helmet()); // הגדרת כותרות HTTP לאבטחה משופרת

// נתיבים
app.use('/api/recipes', recipeRoutes); // נתיבים הקשורים למתכונים
app.use('/api/users', userRoutes); // נתיבים הקשורים למשתמשים

// חיבור למסד הנתונים MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // סיום התהליך במקרה של שגיאת התחברות
  });

// טיפול בשגיאות לא מטופלות
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// הגדרת פורט והפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));