import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import authService from '../services/auth.service';
import { NewUser, Signup } from '../interfaces/user';
import { config, logger } from '@e-commerce-monorepo/configs';
import httpStatus from 'http-status';

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
    path: 'auth/refresh-token',
    maxAge: 1000 * 60 * 60 * 24 * 14, // two weeks
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.expiresIn, // ten minutes
  });
  logger.info(`Signup successful with email: ${user.email}`);
  res.status(httpStatus.CREATED).send(user);
};

export default Object.freeze({
  signup,
});
