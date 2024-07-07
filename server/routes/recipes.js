import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getAllRecipes, 
  getRecipe, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe, 
  rateRecipe,
  getUserRecipes  // נוסיף פונקציה חדשה
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/user/:userId', getUserRecipes); 
router.get('/:id', getRecipe);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/rate', protect, rateRecipe);

export default router;