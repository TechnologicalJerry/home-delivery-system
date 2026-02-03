// SMS provider (Twilio)
import { createLogger } from '@home-delivery/shared';
import { config } from '../config';

const logger = createLogger('sms-provider');

export class SMSProvider {
  async sendSMS(to: string, message: string): Promise<void> {
    // In production, use Twilio SDK
    logger.info('SMS sent', { to });
    // Simulate SMS sending
    console.log(`[SMS] To: ${to}, Message: ${message}`);
  }
}
