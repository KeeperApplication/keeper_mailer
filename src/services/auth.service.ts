import crypto from 'crypto';
import { saveOTP, getOTP, deleteOTP } from './otp.service.js';
import { mailQueue } from '../queues/mail.queue.js';
import axios from 'axios';
import { env } from '../config/env.js';

function generateNumericCode(length: number): string {
  return crypto.randomInt(0, 10 ** length).toString().padStart(length, '0');
}

export async function requestVerificationCode(email: string): Promise<void> {
  const code = generateNumericCode(6);
  await saveOTP(email, code);

  const emailSubject = `Your Keeper Verification Code: ${code}`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="text-align: center; color: #333;">Keeper Auth Verification</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">Please use the verification code below to complete your login.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px;">
          ${code}
        </span>
      </div>
      <p style="font-size: 16px;">This code will expire in 10 minutes.</p>
      <p style="font-size: 14px; color: #777;">If you did not request this code, you can safely ignore this email.</p>
    </div>
  `;
  const emailText = `Your Keeper verification code is: ${code}. This code expires in 10 minutes. If you did not request this code, you can safely ignore this email.`;

  await mailQueue.add('send-verification-email', {
    to: email,
    subject: emailSubject,
    text: emailText,
    html: emailHtml,
  });
}

export async function verifyCodeAndGetToken(email: string, code: string): Promise<string> {
  const storedCode = await getOTP(email);

  if (!storedCode || storedCode !== code) {
    throw new Error('Invalid or expired verification code');
  }

  await deleteOTP(email);

  const keeperApiUrl = env.KEEPER_API_URL;
  if (!keeperApiUrl) {
    throw new Error('KEEPER_API_URL is not configured in .env');
  }

  const response = await axios.post(`${keeperApiUrl}/api/auth/otp-login`, { email });

  if (response.status !== 200 || !response.data.token) {
    throw new Error('Failed to finalize login session with the main service');
  }

  return response.data.token;
}