import Recipe from '../models/Recipe.js';

// פונקציית עזר לטיפול בשגיאות
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({ message: error.message || 'שגיאה בשרת' });
};

// קבלת כל המתכונים
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'username');
    res.json(recipes);
  } catch (error) {
    handleError(res, error);
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

// יצירת מתכון חדש
export const createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      createdBy: req.user._id
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    handleError(res, error, 400);
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