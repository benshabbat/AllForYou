import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // בדיקה אם קיים טוקן בכותרת Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // חילוץ הטוקן מהכותרת
      token = req.headers.authorization.split(' ')[1];

      // אימות הטוקן
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // מציאת המשתמש לפי ה-ID מהטוקן ושמירתו ב-req.user
      // הסיסמה לא נכללת בתוצאה
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'לא מורשה, טוקן לא תקין' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'לא מורשה, אין טוקן' });
  }
};