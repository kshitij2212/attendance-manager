import express from 'express';
import { checkIN, checkOut, getAllAttendance, getattendancebyId } from '../controllers/AttendanceController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getAllAttendance);
router.get('/:employeeId', authMiddleware, getattendancebyId);
router.post('/check-in', authMiddleware, checkIN);
router.post('/check-out', authMiddleware, checkOut);

export default router;
