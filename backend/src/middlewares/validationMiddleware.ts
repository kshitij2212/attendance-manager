import { NextFunction, Request, Response } from 'express';

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing: string[] = [];
    for (const f of requiredFields) {
      if (req.body == null || typeof req.body[f] === 'undefined' || req.body[f] === null) missing.push(f);
    }

    if (missing.length) {
      return res.status(400).json({ message: 'Missing required fields', missing });
    }

    next();
  };
};

export default validateBody;
