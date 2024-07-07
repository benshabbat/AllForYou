import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // בדיקה אם קיים טוקן בכותרת Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // חילוץ הטוקן מהכותרת
      token = req.headers.authorization.split(' ')[1];
    }

    // אם לא נמצא טוקן
    if (!token) {
      return res.status(401).json({ message: 'גישה נדחתה. נדרש אימות.' });
    }

    // אימות הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // מציאת המשתמש לפי המזהה בטוקן וצירופו לבקשה
    // '-password' מסיר את שדה הסיסמה מהתוצאה
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'משתמש לא נמצא' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'גישה נדחתה. טוקן לא תקין.' });
  }
};