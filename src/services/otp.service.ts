import { redis } from '../config/redis.js';

const OTP_EXPIRATION_SECONDS = 10 * 60;

function getRedisKey(email: string): string {
  return `otp:${email}`;
}

export async function saveOTP(email: string, code: string): Promise<void> {
  const key = getRedisKey(email);
  await redis.set(key, code, 'EX', OTP_EXPIRATION_SECONDS);
}

export async function getOTP(email: string): Promise<string | null> {
  const key = getRedisKey(email);
  return redis.get(key);
}

export async function deleteOTP(email: string): Promise<void> {
  const key = getRedisKey(email);
  await redis.del(key);
}