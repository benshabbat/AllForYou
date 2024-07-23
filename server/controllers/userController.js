import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { updateLastLogin } from '../services/userService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'משתמש עם אימייל או שם משתמש זה כבר קיים' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'אנא ספק אימייל וסיסמה' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }

    const token = generateToken(user._id);
    
    await updateLastLogin(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'שגיאה בהתחברות. נסה שוב מאוחר יותר.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'שגיאה בקבלת פרטי המשתמש' });
  }
};

export const toggleFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.recipeId;

    const isFavorite = user.favorites.includes(recipeId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();

    res.json({ success: true, isFavorite: !isFavorite });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון מתכונים מועדפים' });
  }
};

export const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת מתכונים מועדפים' });
  }
};

export const updateAllergenPreferences = async (req, res) => {
  try {
    const { allergenPreferences } = req.body;
    
    if (!Array.isArray(allergenPreferences)) {
      return res.status(400).json({ message: 'allergenPreferences חייב להיות מערך' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { allergenPreferences },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    res.json({ message: 'העדפות האלרגנים עודכנו בהצלחה', user });
  } catch (error) {
    console.error('Update allergen preferences error:', error);
    res.status(500).json({ message: 'שגיאה בעדכון העדפות האלרגנים' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'פרופיל המשתמש עודכן בהצלחה', user: userResponse });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'שגיאה בעדכון פרופיל המשתמש' });
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'שגיאה בטעינת נתוני המשתמש' });
  }
};

export const addToScanHistory = async (req, res) => {
  try {
    const { productCode, productName } = req.body;
    const userId = req.user.id;

    const scanRecord = await ScanHistory.create({
      user: userId,
      productCode,
      productName,
    });

    res.status(201).json(scanRecord);
  } catch (error) {
    console.error('Error adding to scan history:', error);
    res.status(500).json({ message: 'Error saving scan history' });
  }
};

export const getScanHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const scanHistory = await ScanHistory.find({ user: userId }).sort({ createdAt: -1 });
    res.json(scanHistory);
  } catch (error) {
    console.error('Error fetching scan history:', error);
    res.status(500).json({ message: 'Error fetching scan history' });
  }
};

export const getUserAllergens = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('allergenPreferences');
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user.allergenPreferences);
  } catch (error) {
    console.error('Get user allergens error:', error);
    res.status(500).json({ message: 'שגיאה בקבלת אלרגנים של המשתמש' });
  }
};

export const getUserActivities = async (req, res) => {
  try {
    const userId = req.params.userId;
    // כאן תהיה הלוגיקה לקבלת פעילויות המשתמש
    // לדוגמה:
    // const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 });
    // res.json(activities);
    res.json([]); // כרגע מחזיר מערך ריק
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: 'שגיאה בטעינת פעילויות המשתמש' });
  }
};

export default {
  register,
  login,
  getMe,
  toggleFavoriteRecipe,
  getFavoriteRecipes,
  updateAllergenPreferences,
  updateUserProfile,
  getUserData,
  getScanHistory,
  addToScanHistory,
  getUserAllergens,getUserActivities
};