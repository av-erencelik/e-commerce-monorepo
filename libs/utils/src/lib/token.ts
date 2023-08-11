import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const createTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
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
