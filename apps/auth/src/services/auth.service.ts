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
import {
  UserCreated,
  UserPasswordChange,
  UserResend,
  UserResetPassword,
  UserVerified,
} from '@e-commerce-monorepo/event-bus';
import { v4 as uuidv4 } from 'uuid';
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
  const verificationToken = uuidv4();
  await authRedis.setVerificationToken(verificationToken, user.email);
  const userCreatedEvent = new UserCreated();
  await userCreatedEvent.publish({
    userId: user.userId,
    email: user.email,
    fullName: user.fullName,
    verificated: user.verificated,
    version: user.version,
    verificationToken,
  });
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
      isAdmin: user.isAdmin,
    },
  };
};

const logout = async (refreshToken: string) => {
  if (refreshToken === undefined) {
    logger.info('No refresh token');
    return;
  }
  const response = await authRedis.deleteRefreshToken(refreshToken);
  if (response === 0) {
    logger.info('Refresh token not found');
    return;
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
    isAdmin: payload.isAdmin,
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
  const updatedUser = await authRepository.getCurrentUser(user.userId);
  const { accessToken, refreshToken: newRefreshToken } =
    createTokens(updatedUser);
  await authRedis.setRefreshToken(newRefreshToken, user);
  await authRedis.deleteRefreshToken(refreshToken);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const verifyEmail = async (token: string, currentRefreshToken?: string) => {
  const email = await authRedis.getVerificationToken(token);
  logger.info(`token: ${token}`);
  if (!email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
  const user = await authRepository.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
  const updatedUser = await authRepository.verifyUser(user.email);
  logger.info('updatedUser', updatedUser);
  // delete token from redis and create tokens with updated user data
  await authRedis.deleteVerificationToken(token);
  if (currentRefreshToken) {
    await authRedis.deleteRefreshToken(currentRefreshToken);
  }
  const { accessToken, refreshToken } = createTokens(updatedUser);
  await authRedis.setRefreshToken(refreshToken, updatedUser);
  const userVerifiedEvent = new UserVerified();
  await userVerifiedEvent.publish(updatedUser);
  return { updatedUser, accessToken, refreshToken };
};

const resendVerificationEmail = async (user?: AccessTokenPayload) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  const verificationToken = uuidv4();
  await authRedis.setVerificationToken(verificationToken, user.email);
  const userResendEvent = new UserResend();
  await userResendEvent.publish({
    userId: user.userId,
    email: user.email,
    fullName: user.fullName,
    verificated: user.verificated,
    verificationToken,
  });
  return user.email;
};

const forgotPassword = async (email: string) => {
  const user = await authRepository.getUserByEmail(email);
  if (!user) {
    return;
  }
  const passwordReset = await authRepository.getResetPasswordToken(user.userId);
  if (passwordReset) {
    await authRepository.deleteResetPasswordToken(user.userId);
  }
  const resetPasswordToken = uuidv4();
  // Date.now() + 1000 * 60 * 60 => 1 hour
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const hashedToken = await hashPassword(resetPasswordToken);
  await authRepository.setResetPasswordToken(user, hashedToken, expiresAt);
  const userResetPasswordEvent = new UserResetPassword();
  await userResetPasswordEvent.publish({
    email: user.email,
    url: `${process.env.CLIENT_URL}login/reset-password/${resetPasswordToken}?id=${user.userId}`,
    fullName: user.fullName,
  });
};

const resetPassword = async (
  token: string,
  password: string,
  userId: string
) => {
  const userWithPasswordToken =
    await authRepository.getResetPasswordTokenWithUser(userId);

  if (!userWithPasswordToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
  const { passwordReset, ...user } = userWithPasswordToken;
  if (passwordReset.expiresAt < new Date()) {
    await authRepository.deleteResetPasswordToken(passwordReset.userId);
    throw new ApiError(httpStatus.FORBIDDEN, 'Token expired');
  }
  const isTokenMatch = await comparePassword(token, passwordReset.token);
  if (!isTokenMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
  const hashedPassword = await hashPassword(password);
  await authRepository.updatePassword(passwordReset.userId, hashedPassword);
  await authRepository.deleteResetPasswordToken(passwordReset.userId);
  const userPasswordChangedEvent = new UserPasswordChange();
  await userPasswordChangedEvent.publish({
    email: user.email,
    fullName: user.fullName,
  });
  return passwordReset.userId;
};

const updateUser = async (
  user: AccessTokenPayload | undefined,
  fullName: string,
  phoneNumber: string,
  countryCode: string
) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  await authRepository.updateUser(
    user.userId,
    fullName,
    phoneNumber,
    countryCode
  );
};

const getUser = async (user: AccessTokenPayload | undefined) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized');
  }
  const currentUser = await authRepository.getCurrentUser(user.userId);
  return {
    email: currentUser.email,
    userId: currentUser.userId,
    fullName: currentUser.fullName,
    countryCode: currentUser.countryCode,
    phoneNumber: currentUser.phoneNumber,
  };
};

export default Object.freeze({
  signupWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  getCurrentUser,
  refreshTokens,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateUser,
  getUser,
});
