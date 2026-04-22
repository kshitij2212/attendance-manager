import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import leaveRoutes from './routes/leaveRoutes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.send('Hey Attendance-Manager'));
app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

export default app;
