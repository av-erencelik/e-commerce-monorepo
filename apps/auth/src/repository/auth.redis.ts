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
  await redis.del(`refreshToken:${refreshToken}`);
};

export default Object.freeze({
  setRefreshToken,
  getUserByRefreshToken,
  deleteRefreshToken,
});
