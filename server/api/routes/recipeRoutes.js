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

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/suggestions', getSearchSuggestions);
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.post('/:id/rate', rateRecipe);
router.post('/:id/favorite', toggleFavorite);
router.get('/popular', getPopularRecipes);

export default router;