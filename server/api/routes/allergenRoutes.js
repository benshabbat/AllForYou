import express from 'express';
import { 
  getAllergens, 
  getAllergenById, 
  createAllergen, 
  updateAllergen, 
  deleteAllergen, 
  searchAllergens, 
  getAllergensBySymptom,
  getAllergensByIds  // יש להוסיף פונקציה זו לקונטרולר
} from '../controllers/allergenController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllergens)
  .post(protect, authorize('admin'), createAllergen);

router.route('/search')
  .get(searchAllergens);

router.route('/symptom/:symptom')
  .get(getAllergensBySymptom);

router.route('/byIds')
  .get(getAllergensByIds); 

router.route('/:id')
  .get(getAllergenById)
  .put(protect, authorize('admin'), updateAllergen)
  .delete(protect, authorize('admin'), deleteAllergen);
router.get('/byIds', getAllergensByIds);

export default router;