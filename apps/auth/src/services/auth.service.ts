import { logger } from '@e-commerce-monorepo/configs';
import authRepository from '../repository/auth.repository';
import { ApiError } from '@e-commerce-monorepo/errors';
import httpStatus from 'http-status';

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  logger.info(`Login attempt with email: ${email}`);
  logger.info(`Login attempt with password: ${password}`);
  const user = await authRepository.getUser(email);
  if (user.length === 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }
  return user;
};

export default Object.freeze({
  loginUserWithEmailAndPassword,
});
