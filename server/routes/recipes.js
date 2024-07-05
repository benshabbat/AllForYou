import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, rateRecipe } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.post('/:id/rate', protect, rateRecipe);

export default router;