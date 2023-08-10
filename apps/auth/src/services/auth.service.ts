import authRepository from '../repository/auth.repository';
import { ApiError } from '@e-commerce-monorepo/errors';
import httpStatus from 'http-status';
import { createTokens, hashPassword } from '@e-commerce-monorepo/utils';
import { NewUser } from '../interfaces/user';
import { nanoid } from 'nanoid';
const signupWithEmailAndPassword = async (newUser: NewUser) => {
  const existingUser = await authRepository.checkUserExists(
    newUser.email,
    newUser.phoneNumber
  );
  if (existingUser.length !== 0) {
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
  return {
    accessToken,
    refreshToken,
    user,
  };
};

export default Object.freeze({
  signupWithEmailAndPassword,
});
