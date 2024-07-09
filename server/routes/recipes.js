import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  getUserRecipes
} from '../controllers/recipeController.js';

const router = express.Router();

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes
 * @access  Public
 */
router.get('/', getAllRecipes);

/**
 * @route   GET /api/recipes/:id
 * @desc    Get a single recipe by ID
 * @access  Public
 */
router.get('/:id', getRecipe);

// Protected routes
router.use(protect);

/**
 * @route   POST /api/recipes
 * @desc    Create a new recipe
 * @access  Private
 */
router.post('/', createRecipe);

/**
 * @route   PUT /api/recipes/:id
 * @desc    Update a recipe
 * @access  Private
 */
router.put('/:id', updateRecipe);

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete a recipe
 * @access  Private
 */
router.delete('/:id', deleteRecipe);

/**
 * @route   POST /api/recipes/:id/rate
 * @desc    Rate a recipe
 * @access  Private
 */
router.post('/:id/rate', rateRecipe);

/**
 * @route   GET /api/recipes/user/:userId
 * @desc    Get all recipes for a specific user
 * @access  Private
 */
router.get('/user/:userId', getUserRecipes);

export default router;