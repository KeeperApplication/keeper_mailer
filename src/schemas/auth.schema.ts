import { z } from 'zod';

export const requestCodeSchema = z.object({
  email: z.email(),
});

export const verifyCodeSchema = z.object({
  email: z.email(),
  code: z.string().min(6).max(6),
});

export interface MailJobData {
  to: string;
  subject: string;
  text: string;
  html: string;
}