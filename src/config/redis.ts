import { Redis } from 'ioredis';
import { env } from './env.js';

export const redisConnectionOptions = {
  host: env.REDIS_HOST || 'localhost',
  port: Number(env.REDIS_PORT) || 6379,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConnectionOptions);