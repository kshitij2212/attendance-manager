import { NextFunction, Request, Response } from 'express';

type Role = string;

export const roleMiddleware = (allowed: Role | Role[]) => {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by authMiddleware earlier in the chain
    const user = (req as any).user;
    if (!user || !user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

export default roleMiddleware;
