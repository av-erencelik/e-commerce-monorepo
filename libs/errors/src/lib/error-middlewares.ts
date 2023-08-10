import httpStatus from 'http-status';
import { ApiError } from './api-error';
import { DrizzleError } from 'drizzle-orm';
import { config, logger } from '@e-commerce-monorepo/configs';

const notFoundHandler = (req, res, next) => {
  const err = new ApiError(httpStatus.NOT_FOUND, 'Not found');
  return next(err);
};

const errorConverterMiddleware = (err: ApiError | Error, req, res, next) => {
  const error = errorConverter(err);
  next(error);
};

const errorConverter = (err: ApiError | Error) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error instanceof DrizzleError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, [], false, err.stack);
  }
  return error as ApiError;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ApiError, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  logger.info(err);

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
    ...(err.errors != undefined &&
      err.errors.length > 0 && { errors: err.errors }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export {
  errorConverter,
  errorHandler,
  notFoundHandler,
  errorConverterMiddleware,
};
