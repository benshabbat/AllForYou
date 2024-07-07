import Recipe from '../models/Recipe.js';

// קבלת כל המתכונים
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// קבלת מתכון ספציפי
export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'מתכון לא נמצא' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// יצירת מתכון חדש
export const createRecipe = async (req, res) => {
  const recipe = new Recipe({
    ...req.body,
    createdBy: req.user._id // נניח שיש לנו middleware אימות שמוסיף את המשתמש לבקשה
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// עדכון מתכון
export const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// מחיקת מתכון
export const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'מתכון נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // בדיקה אם המשתמש כבר דירג את המתכון
    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // עדכון דירוג קיים
      recipe.ratings[existingRatingIndex].rating = rating;
    } else {
      // הוספת דירוג חדש
      recipe.ratings.push({ user: req.user._id, rating });
    }

    recipe.calculateAverageRating();
    await recipe.save();

    res.json({ averageRating: recipe.averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'נדרש מזהה משתמש תקין' });
    }
    const recipes = await Recipe.find({ createdBy: userId });
    res.json(recipes);
  } catch (error) {
    console.error('Error in getUserRecipes:', error);
    res.status(500).json({ message: error.message });
  }
};