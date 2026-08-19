import { Router } from 'express';
import { getCurrentUser, login, registerFaculty, registerStudent } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register/student', registerStudent);
router.post('/register/faculty', registerFaculty);
router.post('/login', login);
router.get('/me', requireAuth, getCurrentUser);
export default router;