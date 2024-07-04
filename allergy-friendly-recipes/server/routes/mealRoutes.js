import express from 'express';
import { getMeals, addMeal } from '../controllers/mealController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getMeals);
router.post('/', addMeal);
router.post('/', authenticateToken, addMeal);
router.get('/substitutes', fetchSubstituteOptions);

export default router;