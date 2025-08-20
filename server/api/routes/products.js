import express from 'express';
import { addProduct, getProduct } from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addProduct);
router.get('/:barcode', getProduct);

export default router;