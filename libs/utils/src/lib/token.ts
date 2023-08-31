import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AccessTokenPayload } from './types';

const createTokens = (user: AccessTokenPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_EXPIRES_IN not defined');
  }
  const accessToken = jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      verificated: user.verificated,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
      issuer: process.env.JWT_ISSUER,
    }
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
};

export { createTokens };
