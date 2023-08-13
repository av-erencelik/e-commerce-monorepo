import Redis from 'ioredis';
import config from '../config/config';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

export { redis };
