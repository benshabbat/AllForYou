import express from 'express';
import {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  toggleFavorite,
  getSearchSuggestions,
  getPopularRecipes,
} from '../controllers/recipeController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAllRecipes);
router.get('/suggestions', getSearchSuggestions);
router.get('/popular', getPopularRecipes);
router.get('/:id', optionalAuth, getRecipe);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/rate', protect, rateRecipe);
router.post('/:id/favorite', protect, toggleFavorite);

export default router;