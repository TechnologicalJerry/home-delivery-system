import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PRODUCT_SERVICE_PORT || '3003', 10),
  database: {
    url: process.env.PRODUCT_DATABASE_URL || `postgresql://${process.env.PRODUCT_DB_USER || 'postgres'}:${process.env.PRODUCT_DB_PASSWORD || 'postgres'}@${process.env.PRODUCT_DB_HOST || 'localhost'}:${process.env.PRODUCT_DB_PORT || '5432'}/${process.env.PRODUCT_DB_NAME || 'product_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
};
