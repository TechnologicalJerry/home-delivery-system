import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.DELIVERY_SERVICE_PORT || '3008', 10),
  database: {
    url: process.env.DELIVERY_DATABASE_URL || `postgresql://${process.env.DELIVERY_DB_USER || 'postgres'}:${process.env.DELIVERY_DB_PASSWORD || 'postgres'}@${process.env.DELIVERY_DB_HOST || 'localhost'}:${process.env.DELIVERY_DB_PORT || '5432'}/${process.env.DELIVERY_DB_NAME || 'delivery_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
};
