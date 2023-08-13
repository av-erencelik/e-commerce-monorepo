import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import authService from '../services/auth.service';
import { Login, NewUser, Signup } from '../interfaces/user';
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
    path: '/auth/refreshtoken/',
    sameSite: 'none',
    maxAge: config.refreshToken.expiresIn, // two weeks
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'none',
    maxAge: config.jwt.expiresIn, // ten minutes
  });
  logger.info(`Signup successful with email: ${user.email}`);
  res.status(httpStatus.CREATED).send({ user });
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
    secure: true,
    path: '/auth/refreshtoken/',
    sameSite: 'none',
    maxAge: config.refreshToken.expiresIn, // two weeks
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: config.jwt.expiresIn, // ten minutes
  });
  logger.info(`Login successful with email: ${user.email}`);
  res.send({ user });
};

export default Object.freeze({
  signup,
  login,
});
