import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.CART_SERVICE_PORT || '3005', 10),
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  cart: {
    ttl: parseInt(process.env.CART_TTL || '86400', 10), // 24 hours
  },
};
