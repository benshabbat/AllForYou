import express from 'express';
import { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;