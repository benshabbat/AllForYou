import Recipe from '../models/Recipe.js';
import logger from '../utils/logger.js';
import Fuse from 'fuse.js';
import { validateRecipe } from '../utils/validators.js';
import { validateAllergens, validateAlternatives } from '../utils/allergenValidator.js';
// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  logger.error(`Error in recipe controller: ${error.message}`);
  res.status(statusCode).json({ message: error.message || 'Server error' });
};


// פונקציה חדשה לקבלת הצעות חיפוש
export const getSearchSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;
    const recipes = await Recipe.find({}, 'name');
    
    const fuse = new Fuse(recipes, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.4
    });

    const results = fuse.search(keyword);
    const suggestions = results.slice(0, 5).map(result => result.item.name);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// עדכון פונקציית החיפוש הקיימת
export const getAllRecipes = async (req, res) => {
  try {
    const { keyword, category, difficulty, allergens, maxPrepTime, maxCalories, page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (keyword) {
      const recipes = await Recipe.find({});
      const fuse = new Fuse(recipes, {
        keys: ['name', 'ingredients', 'instructions'],
        includeScore: true,
        threshold: 0.4
      });

      const results = fuse.search(keyword);
      const recipeIds = results.map(result => result.item._id);
      query._id = { $in: recipeIds };
    }

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (allergens) query.allergens = { $nin: allergens.split(',') };
    if (maxPrepTime) query.preparationTime = { $lte: parseInt(maxPrepTime) };
    if (maxCalories) query['nutritionInfo.calories'] = { $lte: parseInt(maxCalories) };

    const totalRecipes = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('allergens')
      .limit(parseInt(limit))
      .skip(startIndex)
      .sort({ createdAt: -1 });

    res.json({
      recipes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    .populate('createdBy', 'username')
    .populate('allergens');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    handleError(res, error);
  }
};

export const createRecipe = async (req, res) => {
  try {
    const { error } = validateRecipe(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { allergens, alternatives, ...otherFields } = req.body;

    const validAllergens = await validateAllergens(allergens);
    const validAlternatives = await validateAlternatives(alternatives);

    const newRecipe = new Recipe({
      ...otherFields,
      allergens: validAllergens,
      alternatives: validAlternatives,
      createdBy: req.user._id
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה ביצירת המתכון', error: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { error } = validateRecipe(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { allergens, alternatives, ...otherFields } = req.body;

    const validAllergens = await validateAllergens(allergens);
    const validAlternatives = await validateAlternatives(alternatives);

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...otherFields,
        allergens: validAllergens,
        alternatives: validAlternatives
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'המתכון לא נמצא' });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון המתכון', error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    logger.info(`Recipe deleted: ${req.params.id}`);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

export const rateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
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
    
    logger.info(`Recipe rated: ${recipe._id}, rating: ${rating}`);
    res.json({ averageRating: recipe.averageRating });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const recipes = await Recipe.find({ createdBy: userId }).populate('createdBy', 'username');
    res.json(recipes);
  } catch (error) {
    handleError(res, error);
  }
};

export const getRecipeComments = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate({
      path: 'comments.user',
      select: 'username'
    });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    if (recipe.comments.length === 0) {
      return res.json({ message: 'No comments yet for this recipe', comments: [] });
    }
    
    res.json({ comments: recipe.comments });
  } catch (error) {
    handleError(res, error);
  }
};

export const addRecipeComment = async (req, res) => {
  try {
    const { content } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const newComment = {
      user: req.user._id,
      content
    };
    
    recipe.comments.push(newComment);
    await recipe.save();
    
    logger.info(`New comment added to recipe: ${recipe._id}`);
    res.status(201).json(newComment);
  } catch (error) {
    handleError(res, error, 400);
  }
};
export const toggleFavorite = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const isFavorite = user.favorites.includes(recipeId);

    if (isFavorite) {
      // הסר מהמועדפים
      await User.findByIdAndUpdate(userId, { $pull: { favorites: recipeId } });
    } else {
      // הוסף למועדפים
      await User.findByIdAndUpdate(userId, { $addToSet: { favorites: recipeId } });
    }

    res.json({ success: true, isFavorite: !isFavorite });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון המועדפים', error: error.message });
  }
};