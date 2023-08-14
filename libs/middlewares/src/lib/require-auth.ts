import { ApiError } from '@e-commerce-monorepo/errors';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  next();
};

export { requireAuth };
