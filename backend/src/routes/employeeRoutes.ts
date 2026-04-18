import express from 'express';
import { createEmployee, deleteEmployee, getAllEmployee, getEmployeebyId, updateEmployee, assignDepartment } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createEmployee);
router.get('/', authMiddleware, getAllEmployee);
router.get('/:id', authMiddleware, getEmployeebyId);
router.put('/:id', authMiddleware, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);
router.put('/:id/department', authMiddleware, assignDepartment);

export default router;
