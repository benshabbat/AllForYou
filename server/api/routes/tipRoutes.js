import express from 'express';
import { tipController } from '../controllers/tipController.js';

const router = express.Router();

router.get('/daily', tipController.getDailyTip.bind(tipController));

export default router;