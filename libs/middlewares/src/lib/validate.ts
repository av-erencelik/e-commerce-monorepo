import { ApiError } from '@e-commerce-monorepo/errors';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        next(
          new ApiError(
            httpStatus.FORBIDDEN,
            "The request's body, query or params is invalid",
            e.errors
          )
        );
      }
      next(e);
    }
  };
