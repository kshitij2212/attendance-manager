import express from 'express';
import { applyLeave, approveLeave, rejectLeave, getallLeaves, getLeavesByID } from '../controllers/LeaveController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/apply', authMiddleware, applyLeave);
router.put('/approve/:id', authMiddleware, approveLeave);
router.put('/reject/:id', authMiddleware, rejectLeave);
router.get('/', authMiddleware, getallLeaves);
router.get('/employee/:employeeId', authMiddleware, getLeavesByID);

export default router;
