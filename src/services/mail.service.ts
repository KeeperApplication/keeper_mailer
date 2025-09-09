import { env } from '../config/env.js';
import { transporter } from '../config/mailer.js';
import type { MailJobData } from '../schemas/auth.schema.js';

export class MailService {
  async send(mailData: MailJobData) {
    const { to, subject, text, html } = mailData;

    try {
      const info = await transporter.sendMail({
        from: env.MAIL_FROM,
        to,
        subject,
        text,
        html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: 'Failed to send email.',
      };
    }
  }
}