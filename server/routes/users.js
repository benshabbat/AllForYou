import express from 'express';
import { register, login, getMe } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// נתיב להרשמת משתמש חדש
// POST /api/users/register
router.post('/register', register);

// נתיב להתחברות משתמש קיים
// POST /api/users/login
router.post('/login', login);

// נתיב לקבלת פרטי המשתמש המחובר
// GET /api/users/me
// מוגן על ידי middleware - רק משתמשים מאומתים יכולים לגשת
router.get('/me', protect, getMe);

export default router;