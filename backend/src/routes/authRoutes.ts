import express from 'express';
import { register, Login } from '../controllers/AuthController';

const router = express.Router();

router.post('/register', register);
router.post('/login', Login);

export default router;
