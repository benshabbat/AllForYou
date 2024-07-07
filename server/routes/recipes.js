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

// נתיבים ציבוריים
router.get('/', getAllRecipes);
router.get('/:id', getRecipe);

// נתיבים מוגנים (דורשים אימות)
router.use(protect); // כל הנתיבים מתחת לשורה זו יהיו מוגנים

router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.post('/:id/rate', rateRecipe);
router.get('/user/:userId', getUserRecipes);

export default router;