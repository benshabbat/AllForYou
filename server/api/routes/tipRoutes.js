import express from 'express';
import { getDailyTip, createTip, getAllTips } from '../controllers/tipController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/daily', getDailyTip);
router.post('/', protect, createTip);
router.get('/', getAllTips);

export default router;