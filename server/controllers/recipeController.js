import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import Recipe from '../models/Recipe.js';

// Change: Import new utilities
import logger from '../utils/logger.js';
import { getCache, setCache, clearCache } from '../utils/cache.js';
import { indexRecipe, searchRecipes } from '../utils/elasticsearch.js';

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  // Change: Use logger instead of console.error
  logger.error(`Error in recipe controller: ${error.message}`);
  res.status(statusCode).json({ message: error.message || 'Server error' });
};

// Validation definitions
export const createRecipeValidation = [
  body('name').notEmpty().withMessage('Recipe name is required').trim().escape(),
  body('ingredients').isArray().withMessage('Ingredients must be an array')
    .custom((value) => value.every((item) => typeof item === 'string')).withMessage('Each ingredient must be a string'),
  body('instructions').notEmpty().withMessage('Instructions are required').trim().escape(),
];

export const createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      createdBy: req.user._id
    });
    const savedRecipe = await newRecipe.save();
    
    // Change: Index the recipe in Elasticsearch
    await indexRecipe(savedRecipe);
    
    // Change: Log new recipe creation
    logger.info(`New recipe created: ${savedRecipe._id}`);
    
    res.status(201).json(savedRecipe);
  } catch (error) {
    // Change: Use handleError function
    handleError(res, error, 400);
  }
};

// Change: New function for Elasticsearch recipe search
export const searchRecipesElastic = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchRecipes(query);
    res.json(results);
  } catch (error) {
    handleError(res, error);
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Add search functionality if needed
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // If user is authenticated, we can add personalized queries here
    if (req.user) {
      // For example, maybe exclude recipes the user has already rated
      // query.ratings = { $not: { $elemMatch: { user: req.user._id } } };
    }

    const totalRecipes = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
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
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};
// Get a specific recipe
export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    handleError(res, error);
  }
};

// Update a recipe
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
    
    // Change: Update Elasticsearch index
    await indexRecipe(updatedRecipe);
    
    // Change: Clear cache for the updated recipe
    await clearCache(`recipe:${updatedRecipe._id}`);
    
    logger.info(`Recipe updated: ${updatedRecipe._id}`);
    
    res.json(updatedRecipe);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Change: Clear cache for the deleted recipe
    await clearCache(`recipe:${req.params.id}`);
    
    logger.info(`Recipe deleted: ${req.params.id}`);
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

// Rate a recipe
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
    
    // Change: Update Elasticsearch index
    await indexRecipe(recipe);
    
    // Change: Clear cache for the rated recipe
    await clearCache(`recipe:${recipe._id}`);
    
    logger.info(`Recipe rated: ${recipe._id}, rating: ${rating}`);

    res.json({ averageRating: recipe.averageRating });
  } catch (error) {
    handleError(res, error);
  }
};

// Get recipes for a specific user
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

// Get comments for a specific recipe
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

// Add a comment to a recipe
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
    
    // Change: Clear cache for the recipe with new comment
    await clearCache(`recipe:${recipe._id}`);
    
    logger.info(`New comment added to recipe: ${recipe._id}`);
    
    res.status(201).json(newComment);
  } catch (error) {
    handleError(res, error, 400);
  }
};