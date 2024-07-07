import express from 'express';
import { register, login, getMe } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// נתיב להרשמת משתמש חדש
// POST /api/users/register
// גוף הבקשה צריך לכלול: { username, email, password }
router.post('/register', register);

// נתיב להתחברות משתמש קיים
// POST /api/users/login
// גוף הבקשה צריך לכלול: { email, password }
router.post('/login', login);

// נתיב לקבלת פרטי המשתמש המחובר
// GET /api/users/me
// דורש טוקן אימות בכותרת Authorization
router.get('/me', protect, getMe);

export default router;