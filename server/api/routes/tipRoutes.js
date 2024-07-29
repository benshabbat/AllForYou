import express from 'express';
import { tipController } from '../controllers/tipController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/daily', tipController.getDailyTip.bind(tipController));
router.post('/', protect, tipController.createTip.bind(tipController));
router.get('/', tipController.getAllTips.bind(tipController));

export default router;