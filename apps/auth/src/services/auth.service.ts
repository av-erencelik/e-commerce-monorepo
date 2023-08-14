import authRepository from '../repository/auth.repository';
import { ApiError } from '@e-commerce-monorepo/errors';
import httpStatus from 'http-status';
import {
  AccessTokenPayload,
  comparePassword,
  createTokens,
  hashPassword,
} from '@e-commerce-monorepo/utils';
import { NewUser } from '../interfaces/user';
import { nanoid } from 'nanoid';
import authRedis from '../repository/auth.redis';
import { logger } from '@e-commerce-monorepo/configs';
const signupWithEmailAndPassword = async (newUser: NewUser) => {
  const existingUser = await authRepository.checkUserExists(
    newUser.email,
    newUser.phoneNumber
  );
  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Email or phone number already in use'
    );
  }
  const hashedPassword = await hashPassword(newUser.password);

  const user = await authRepository.createUser({
    ...newUser,
    password: hashedPassword,
    userId: nanoid(12),
  });
  const { accessToken, refreshToken } = createTokens(user);
  await authRedis.setRefreshToken(refreshToken, user);
  return {
    accessToken,
    refreshToken,
    user,
  };
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
  const user = await authRepository.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect credentials');
  }

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect credentials');
  }
  const { accessToken, refreshToken } = createTokens(user);
  await authRedis.setRefreshToken(refreshToken, user);

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      userId: user.userId,
      verificated: user.verificated,
      fullName: user.fullName,
    },
  };
};

const logout = async (refreshToken: string) => {
  if (refreshToken === undefined) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'You need to login before logging out'
    );
  }
  const response = await authRedis.deleteRefreshToken(refreshToken);
  if (response === 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

const getCurrentUser = (payload?: AccessTokenPayload) => {
  if (payload === undefined) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token');
  }
  logger.info(`Payload: ${JSON.stringify(payload)}`);
  return {
    email: payload.email,
    userId: payload.userId,
    verificated: payload.verificated,
    fullName: payload.fullName,
  };
};

const refreshTokens = async (refreshToken: string) => {
  if (refreshToken === undefined) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  const user = await authRedis.getUserByRefreshToken(refreshToken);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
  const { accessToken, refreshToken: newRefreshToken } = createTokens(user);
  await authRedis.setRefreshToken(newRefreshToken, user);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export default Object.freeze({
  signupWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  getCurrentUser,
  refreshTokens,
});
