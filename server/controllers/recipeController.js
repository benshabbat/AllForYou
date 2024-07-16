import Recipe from '../models/Recipe.js';
import logger from '../utils/logger.js';

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  logger.error(`Error in recipe controller: ${error.message}`);
  res.status(statusCode).json({ message: error.message || 'Server error' });
};

export const getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Keyword search
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { ingredients: { $regex: req.query.keyword, $options: 'i' } },
        { instructions: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Difficulty filter
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    // Allergens filter
    if (req.query.allergens) {
      const allergenIds = req.query.allergens.split(',');
      query.allergens = { $nin: allergenIds };
    }

    // User allergen preferences
    if (req.user && req.user.allergenPreferences) {
      query.allergens = { 
        $nin: req.user.allergenPreferences,
        ...query.allergens 
      };
    }

    const totalRecipes = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('allergens')
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes
    });
  } catch (error) {
    logger.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
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
    const newRecipe = new Recipe({
      ...req.body,
      createdBy: req.user._id
    });
    const savedRecipe = await newRecipe.save();
    logger.info(`New recipe created: ${savedRecipe._id}`);
    res.status(201).json(savedRecipe);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    logger.info(`Recipe updated: ${updatedRecipe._id}`);
    res.json(updatedRecipe);
  } catch (error) {
    handleError(res, error, 400);
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