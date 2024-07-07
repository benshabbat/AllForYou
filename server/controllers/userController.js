import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// רישום משתמש חדש
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'משתמש עם אימייל או שם משתמש זה כבר קיים' });
    }
    
    // יצירת משתמש חדש
    const user = new User({ username, email, password });
    await user.save();
    
    // יצירת טוקן JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // החזרת פרטי המשתמש ללא הסיסמה
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
};

// התחברות משתמש
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // בדיקה אם המשתמש קיים
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }
    
    // יצירת טוקן JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// קבלת פרטי המשתמש המחובר
export const getMe = async (req, res) => {
  try {
    // מציאת המשתמש לפי ה-ID (שנשמר ב-req.user על ידי ה-middleware)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
};