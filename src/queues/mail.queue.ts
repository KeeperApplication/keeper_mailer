import { Queue } from 'bullmq';
import { redisConnectionOptions } from '../config/redis.js';

export const mailQueue = new Queue('mail-queue', {
  connection: redisConnectionOptions,
});