import { ApiError } from './api-error';
import { ZodIssue } from 'zod';
import { errorConverter } from './error-middlewares';

describe('ApiError', () => {
  const mockStatusCode = 400;
  const mockMessage = 'Bad Request';
  const mockErrors: ZodIssue[] = [
    {
      code: 'invalid_type',
      message: 'Expected string, received number',
      path: ['name'],
      expected: 'string',
      received: 'number',
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of ApiError', () => {
    const error = new ApiError(mockStatusCode, mockMessage, mockErrors);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toEqual(mockStatusCode);
    expect(error.message).toEqual(mockMessage);
    expect(error.errors).toEqual([
      {
        message: 'Expected string, received number',
        path: 'name',
      },
    ]);
    expect(error.isOperational).toEqual(true);
  });

  it('should set isOperational to false if isOperational parameter is false', () => {
    const error = new ApiError(mockStatusCode, mockMessage, mockErrors, false);
    expect(error.isOperational).toEqual(false);
  });
});

describe('errorConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should convert an error to an instance of ApiError', () => {
    const mockError = new Error('Test error');
    const error = errorConverter(mockError);

    expect(error.statusCode).toEqual(500);
    expect(error.message).toEqual('Test error');
    expect(error.isOperational).toEqual(false);
  });

  it('should return the error if it is already an instance of ApiError', () => {
    const mockError = new ApiError(400, 'Bad Request');
    const result = errorConverter(mockError);

    expect(result).toEqual(mockError);
  });
});
