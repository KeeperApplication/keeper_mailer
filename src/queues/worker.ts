import { Worker } from 'bullmq';
import { MailService } from '../services/mail.service.js';
import { redisConnectionOptions } from '../config/redis.js';
import type { MailJobData } from '../schemas/auth.schema.js';

const mailService = new MailService();

export function initializeWorker() {
  new Worker(
    'mail-queue',
    async (job) => {
      const mailData = job.data as MailJobData;
      console.log(`Processing job ${job.id}: Sending email to ${mailData.to}`);

      const result = await mailService.send(mailData);

      if (!result.success) {
        throw new Error(`Failed to send email for job ${job.id}`);
      }

      console.log(`Job ${job.id} completed successfully.`);
    },
    { connection: redisConnectionOptions }
  );
}