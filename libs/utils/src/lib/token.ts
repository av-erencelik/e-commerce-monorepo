import { config } from '@e-commerce-monorepo/configs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const createTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
      issuer: config.jwt.issuer,
    }
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
};

export { createTokens };
