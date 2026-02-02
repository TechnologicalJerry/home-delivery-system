import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '3009', 10),
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  smtp: {
    host: process.env.NOTIFICATION_SMTP_HOST || '',
    port: parseInt(process.env.NOTIFICATION_SMTP_PORT || '587', 10),
    user: process.env.NOTIFICATION_SMTP_USER || '',
    password: process.env.NOTIFICATION_SMTP_PASSWORD || '',
  },
  twilio: {
    accountSid: process.env.NOTIFICATION_TWILIO_ACCOUNT_SID || '',
    authToken: process.env.NOTIFICATION_TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.NOTIFICATION_TWILIO_PHONE_NUMBER || '',
  },
};
