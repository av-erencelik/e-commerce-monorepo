import Redis from 'ioredis';
import RedisMemoryServer from 'redis-memory-server';

let redis: Redis;
const getTestRedis = async () => {
  const redisServer = new RedisMemoryServer();
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  return {
    host,
    port,
  };
};

getTestRedis().then((res) => (redis = new Redis(res)));

export { redis };
