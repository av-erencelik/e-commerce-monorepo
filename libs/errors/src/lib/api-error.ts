import { ZodIssue } from 'zod';

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors: { message: string; path: string | number }[];
  constructor(
    statusCode: number,
    message: string,
    errors: ZodIssue[] = [],
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (errors.length > 0) {
      const validationErrors = errors.map((error) => {
        return {
          message: error.message,
          path: error.path.pop() || '',
        };
      });
      this.errors = validationErrors;
    }
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
