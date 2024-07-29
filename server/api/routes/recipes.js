import express from 'express';
import { recipeController } from '../controllers/recipeController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, recipeController.getAllRecipes.bind(recipeController));
router.get('/suggestions', recipeController.getSearchSuggestions.bind(recipeController));
router.get('/:id', optionalAuth, recipeController.getRecipe.bind(recipeController));
router.post('/', protect, upload.single('image'), recipeController.createRecipe.bind(recipeController));
router.put('/:id', protect, upload.single('image'), recipeController.updateRecipe.bind(recipeController));
router.delete('/:id', protect, recipeController.deleteRecipe.bind(recipeController));
router.post('/:id/rate', protect, recipeController.rateRecipe.bind(recipeController));
router.post('/:id/favorite', protect, recipeController.toggleFavorite.bind(recipeController));

export default router;