import { Router } from 'express';
import { enroll, getMyCourses, getStatus, unenroll } from '../controllers/enrollmentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth, requireRole('student'));
router.get('/my-courses', getMyCourses);
router.get('/:courseId/status', getStatus);
router.post('/:courseId', enroll);
router.delete('/:courseId', unenroll);
export default router;
