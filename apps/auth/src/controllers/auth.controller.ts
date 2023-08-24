import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import authService from '../services/auth.service';
import { Login, NewUser, Signup, Token } from '../interfaces/user';
import { logger } from '@e-commerce-monorepo/configs';
import httpStatus from 'http-status';
import config from '../config/config';

const signup = async (
  req: Request<ParamsDictionary, never, Signup>,
  res: Response
) => {
  const { email, password, phoneNumber, fullName, countryCode } = req.body;
  logger.info(`Signup attempt with email: ${email}`);
  const newUser: NewUser = {
    email,
    password,
    phoneNumber,
    fullName,
    countryCode,
  };
  const { user, accessToken, refreshToken } =
    await authService.signupWithEmailAndPassword(newUser);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.refreshToken.expiresIn,
    domain: '.posts.com', // two weeks
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.expiresIn, // ten minutes
    domain: '.posts.com',
  });
  logger.info(`Signup successful with email: ${user.email}`);
  res.status(httpStatus.CREATED).send({
    user: {
      userId: user.userId,
      email: user.email,
      verificated: user.verificated,
      fullName: user.fullName,
    },
  });
};

const login = async (
  req: Request<ParamsDictionary, never, Login>,
  res: Response
) => {
  // TODO: implement recaptcha
  const { email, password } = req.body;
  const cookies = req.cookies;
  logger.info(`Cookies: ${JSON.stringify(cookies)}`);
  logger.info(`Login attempt with email: ${email}`);
  const { user, accessToken, refreshToken } =
    await authService.loginWithEmailAndPassword(email, password);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.refreshToken.expiresIn, // two weeks
    domain: '.posts.com',
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.expiresIn, // ten minutes
    domain: '.posts.com',
  });
  logger.info(`Login successful with email: ${user.email}`);
  res.send({ user });
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(refreshToken);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: 0, // two weeks
    domain: '.posts.com',
  });
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: 0, // ten minutes
    domain: '.posts.com',
  });
  res.status(httpStatus.OK).send({ message: 'Logout successful' });
};

const getCurrentUser = async (req: Request, res: Response) => {
  const payload = req.user;
  const user = authService.getCurrentUser(payload);
  res.send({ user });
};

const refreshTokens = async (req: Request, res: Response) => {
  const currentRefreshToken = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshTokens(
    currentRefreshToken
  );
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.expiresIn, // ten minutes
    domain: '.posts.com',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.refreshToken.expiresIn, // two weeks
    domain: '.posts.com',
  });

  res.send({ message: 'Tokens refreshed successfully' });
};

const verifyEmail = async (
  req: Request<ParamsDictionary, unknown, unknown, Token>,
  res: Response
) => {
  const currentRefreshToken = req.cookies.refreshToken;
  const token = req.query.token;
  const { accessToken, refreshToken, updatedUser } =
    await authService.verifyEmail(token, currentRefreshToken);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.expiresIn, // ten minutes
    domain: '.posts.com',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.refreshToken.expiresIn, // two weeks
    domain: '.posts.com',
  });

  logger.info(`Email verified: ${updatedUser.email}`);
  res.send({ message: `${updatedUser.email} email verificated` });
};

const resendVerificationEmail = async (req: Request, res: Response) => {
  const user = req.user;
  const email = await authService.resendVerificationEmail(user);
  logger.info(`Verification email sent to: ${email}`);
  res.send({ message: `Verification email sent to ${email}` });
};

export default Object.freeze({
  signup,
  login,
  logout,
  getCurrentUser,
  refreshTokens,
  verifyEmail,
  resendVerificationEmail,
});
