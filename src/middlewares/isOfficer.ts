import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }

  if (req.user.role !== 'officer') {
    return res.sendStatus(403);
  }
  next();
};
