import { Router } from 'express';
import { deleteLecture, updateLecture } from '../controllers/lectureController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
const router = Router();
router.use(requireAuth, requireRole('faculty'));
router.put('/:id', updateLecture);
router.delete('/:id', deleteLecture);
export default router;
