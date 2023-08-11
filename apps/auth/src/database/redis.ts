import Redis from 'ioredis';
import { RedisMemoryServer } from 'redis-memory-server';
import config from '../config/config';

let redis: Redis;
let host: string;
let port: number;
let password: string;

if (process.env.NODE_ENV === 'test') {
  const redisServer = new RedisMemoryServer();
  redisServer.getHost().then((h) => (host = h));
  redisServer.getPort().then((p) => (port = p));
  redis = new Redis({
    host,
    port,
  });
} else {
  host = config.redis.host;
  port = config.redis.port;
  password = config.redis.password;
  redis = new Redis({
    host,
    port,
    password,
  });
}

export default redis;
