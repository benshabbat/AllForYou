import express from 'express';
import { getMeals, addMeal } from '../controllers/mealController.js';

const router = express.Router();

router.get('/', getMeals);
router.post('/', addMeal);
router.get('/substitutes', fetchSubstituteOptions);

export default router;