import { z } from "zod";

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3000),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.email(),
  MAIL_PASS: z.string(),
  MAIL_FROM: z.string(),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  KEEPER_API_URL: z.url(),
  FRONTEND_URL: z.url().optional(),
});

export const env = envSchema.parse(process.env);
