import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
  database: {
    url: process.env.USER_DATABASE_URL || `postgresql://${process.env.USER_DB_USER || 'postgres'}:${process.env.USER_DB_PASSWORD || 'postgres'}@${process.env.USER_DB_HOST || 'localhost'}:${process.env.USER_DB_PORT || '5432'}/${process.env.USER_DB_NAME || 'user_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  cache: {
    userProfileTTL: parseInt(process.env.USER_PROFILE_CACHE_TTL || '3600', 10), // 1 hour
  },
};
