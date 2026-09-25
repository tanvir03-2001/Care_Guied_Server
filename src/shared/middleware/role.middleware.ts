import { NextFunction, Response } from 'express';
import { AppError } from './error.middleware';
import { AuthenticatedRequest, UserRole } from '../types/express.d';

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403));
      return;
    }
    next();
  };
}
