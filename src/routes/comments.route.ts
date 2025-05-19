import { Router } from 'express';
import {
  createComment,
  getCommentsByMarkingId,
  deleteComment,
  updateComment,
} from '../controllers/comment.controller';

const router = Router();

// Public routes
router.post('/', createComment);
router.get('/:id', getCommentsByMarkingId);
router.delete('/:id', deleteComment);
router.put('/:id', updateComment);

export default router;
