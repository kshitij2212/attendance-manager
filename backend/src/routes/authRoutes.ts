import express from 'express';
import { register, Login, getMe } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', Login);
router.get('/me', authMiddleware, getMe);

export default router;
