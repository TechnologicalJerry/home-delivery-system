import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PAYMENT_SERVICE_PORT || '3007', 10),
  database: {
    url: process.env.PAYMENT_DATABASE_URL || `postgresql://${process.env.PAYMENT_DB_USER || 'postgres'}:${process.env.PAYMENT_DB_PASSWORD || 'postgres'}@${process.env.PAYMENT_DB_HOST || 'localhost'}:${process.env.PAYMENT_DB_PORT || '5432'}/${process.env.PAYMENT_DB_NAME || 'payment_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  stripe: {
    secretKey: process.env.PAYMENT_STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.PAYMENT_STRIPE_WEBHOOK_SECRET || '',
  },
};
