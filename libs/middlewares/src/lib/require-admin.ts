import { ApiError } from '@e-commerce-monorepo/errors';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  if (req.user.isAdmin === false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  next();
};

export { requireAdmin };
