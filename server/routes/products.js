import express from 'express';
import { addProduct, getProduct } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addProduct);
router.get('/:barcode', getProduct);

export default router;