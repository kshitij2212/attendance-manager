import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id?: string;
  role?: string;
  [key: string]: any;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Token is not available.' });
  }

  const parts = header.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Invalid authorization header format.' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Auth error', error);
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

export default authMiddleware;
