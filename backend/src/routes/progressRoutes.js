import { Router } from 'express';
import { getCourseProgress, setCompletion } from '../controllers/progressController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
const router = Router();
router.use(requireAuth, requireRole('student'));
router.get('/:courseId', getCourseProgress);
router.patch('/:courseId/:lectureId', setCompletion);
export default router;
