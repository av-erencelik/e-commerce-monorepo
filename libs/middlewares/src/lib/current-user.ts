import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import jwt from 'jsonwebtoken';
import { logger } from '@e-commerce-monorepo/configs';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@e-commerce-monorepo/errors';
import httpStatus from 'http-status';

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_ISSUER) {
    throw new Error('JWT_SECRET not defined');
  }
  const cookies = req.cookies;
  logger.info(`Cookies: ${JSON.stringify(cookies)}`);
  const { accessToken } = req.cookies;
  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER,
      });
      req.user = payload as AccessTokenPayload;
    } catch (err) {
      logger.error(err);
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token');
    }
  }
  next();
};

export { currentUser };
