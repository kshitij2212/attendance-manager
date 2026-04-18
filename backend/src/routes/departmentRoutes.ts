import express from 'express';
import { createDepartment, getAllDepartment, getDepartmentbyID, deleteDepartment, getPublicDepartments } from '../controllers/DepartmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/public', getPublicDepartments);
router.post('/', authMiddleware, createDepartment);
router.get('/', authMiddleware, getAllDepartment);
router.get('/:id', authMiddleware, getDepartmentbyID);
router.delete('/:id', authMiddleware, deleteDepartment);

export default router;
