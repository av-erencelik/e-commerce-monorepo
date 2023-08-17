import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import config from '../config/config';
import { redis } from '../database/redis';

const setRefreshToken = async (
  refreshToken: string,
  user: AccessTokenPayload
) => {
  await redis.set(
    `refreshToken:${refreshToken}`,
    JSON.stringify(user),
    'PX',
    config.refreshToken.expiresIn
  );
};

const getUserByRefreshToken = async (refreshToken: string) => {
  const response = await redis.get(`refreshToken:${refreshToken}`);
  if (!response) {
    return null;
  }
  const user = JSON.parse(response) as AccessTokenPayload;
  return user;
};

const deleteRefreshToken = async (refreshToken: string) => {
  return await redis.del(`refreshToken:${refreshToken}`);
};

const setVerificationToken = async (token: string, email: string) => {
  await redis.set(
    `verificationToken:${token}`,
    email,
    'PX',
    config.verificationToken.expiresIn
  );
};

const getVerificationToken = async (token: string) => {
  const response = await redis.get(`verificationToken:${token}`);
  if (!response) {
    return null;
  }
  return response;
};

const deleteVerificationToken = async (token: string) => {
  return await redis.del(`verificationToken:${token}`);
};

export default Object.freeze({
  setRefreshToken,
  getUserByRefreshToken,
  deleteRefreshToken,
  setVerificationToken,
  getVerificationToken,
  deleteVerificationToken,
});
