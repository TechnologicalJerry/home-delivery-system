// Email provider (SMTP)
import { createLogger } from '@home-delivery/shared';
import { config } from '../config';

const logger = createLogger('email-provider');

export class EmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // In production, use nodemailer or similar
    logger.info('Email sent', { to, subject });
    // Simulate email sending
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}, Body: ${body}`);
  }
}
