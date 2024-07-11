import express from 'express';
import { getAllergens, createAllergen } from '../controllers/allergenController.js';

const router = express.Router();

router.get('/', getAllergens);
router.post('/', createAllergen);

// ... Add other routes for CRUD operations ...

export default router;