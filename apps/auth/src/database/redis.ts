import Redis from 'ioredis';
import config from '../config/config';

const redis =
  config.env === 'test'
    ? new Redis({
        host: 'localhost',
        port: 6379,
      })
    : new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      });

export { redis };
