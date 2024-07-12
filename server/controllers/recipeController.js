
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import logger from '../utils/logger.js';
import Recipe from '../models/Recipe.js';

// פונקציית עזר לטיפול בשגיאות
const handleError = (res, error, statusCode = 500) => {
  logger.error(`Error in recipe controller: ${error.message}`);
  res.status(statusCode).json({ message: error.message || 'שגיאה בשרת' });
};

// הגדרת הוולידציות
export const createRecipeValidation = [
  body('name').notEmpty().withMessage('שם המתכון הוא שדה חובה').trim().escape(),
  body('ingredients').isArray().withMessage('רשימת המרכיבים חייבת להיות מערך')
    .custom((value) => value.every((item) => typeof item === 'string')).withMessage('כל מרכיב חייב להיות מחרוזת'),
  body('instructions').notEmpty().withMessage('הוראות ההכנה הן שדה חובה').trim().escape(),
];

// יצירת מתכון חדש
export const createRecipe = [
  validate(createRecipeValidation),
  async (req, res) => {
    try {
      const newRecipe = new Recipe({
        ...req.body,
        createdBy: req.user._id
      });
      const savedRecipe = await newRecipe.save();
      logger.info(`New recipe created: ${savedRecipe._id}`);
      res.status(201).json(savedRecipe);
    } catch (error) {
      logger.error(`Error creating recipe: ${error.message}`);
      handleError(res, error, 400);
    }
  }
];

// קבלת כל המתכונים
export const getAllRecipes = async (req, res) => {
  try {
    const { keyword, category, allergens, difficulty } = req.query;
    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (allergens) {
      query.allergens = { $nin: allergens.split(',') };
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const recipes = await Recipe.find(query).populate('allergens');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// קבלת מתכון ספציפי
export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא' });
    }
    res.json(recipe);
  } catch (error) {
    handleError(res, error);
  }
};

// עדכון מתכון
export const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// מחיקת מתכון
export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא' });
    }
    res.json({ message: 'מתכון נמחק בהצלחה' });
  } catch (error) {
    handleError(res, error);
  }
};

// דירוג מתכון
export const rateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא' });
    }

    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'דירוג חייב להיות בין 1 ל-5' });
    }

    const ratingIndex = recipe.ratings.findIndex(
      r => r.user.toString() === req.user._id.toString()
    );

    if (ratingIndex !== -1) {
      recipe.ratings[ratingIndex].rating = rating;
    } else {
      recipe.ratings.push({ user: req.user._id, rating });
    }

    recipe.calculateAverageRating();
    await recipe.save();

    res.json({ averageRating: recipe.averageRating });
  } catch (error) {
    handleError(res, error);
  }
};

// קבלת מתכונים של משתמש ספציפי
export const getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'נדרש מזהה משתמש' });
    }
    const recipes = await Recipe.find({ createdBy: userId }).populate('createdBy', 'username');
    res.json(recipes);
  } catch (error) {
    handleError(res, error);
  }
};

// קבלת תגובות למתכון ספציפי
export const getRecipeComments = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'user', select: 'username' }
    });
    
    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא' });
    }
    
    res.json(recipe.comments);
  } catch (error) {
    handleError(res, error);
  }
};

// הוספת תגובה למתכון
export const addRecipeComment = async (req, res) => {
  try {
    const { content } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא' });
    }
    
    const newComment = {
      user: req.user._id,
      content
    };
    
    recipe.comments.push(newComment);
    await recipe.save();
    
    res.status(201).json(newComment);
  } catch (error) {
    handleError(res, error, 400);
  }
};


