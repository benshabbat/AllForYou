import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isModerator } from '../middleware/moderatorMiddleware.js';
import {
  getTopics,
  getTopic,
  createTopic,
  createReply,
  searchTopics,
  deleteTopic,
  deleteReply
} from '../controllers/forumController.js';

const router = express.Router();

router.get('/topics', getTopics);
router.get('/topics/:id', getTopic);
router.post('/topics', protect, createTopic);
router.post('/topics/:id/replies', protect, createReply);
router.get('/search', searchTopics);

router.delete('/topics/:id', protect, isModerator, deleteTopic);
router.delete('/topics/:topicId/replies/:replyId', protect, isModerator, deleteReply);

export default router;