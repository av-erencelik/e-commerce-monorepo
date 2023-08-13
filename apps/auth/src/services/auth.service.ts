import authRepository from '../repository/auth.repository';
import { ApiError } from '@e-commerce-monorepo/errors';
import httpStatus from 'http-status';
import {
  comparePassword,
  createTokens,
  hashPassword,
} from '@e-commerce-monorepo/utils';
import { NewUser } from '../interfaces/user';
import { nanoid } from 'nanoid';
import authRedis from '../repository/auth.redis';
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
  authRedis.setRefreshToken(refreshToken, user);
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
  authRedis.setRefreshToken(refreshToken, user);
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

export default Object.freeze({
  signupWithEmailAndPassword,
  loginWithEmailAndPassword,
});
