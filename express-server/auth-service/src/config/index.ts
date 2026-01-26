import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
  jwtSecret: process.env.AUTH_JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.AUTH_JWT_EXPIRES_IN || '24h',
  database: {
    url: process.env.AUTH_DATABASE_URL || `postgresql://${process.env.AUTH_DB_USER || 'postgres'}:${process.env.AUTH_DB_PASSWORD || 'postgres'}@${process.env.AUTH_DB_HOST || 'localhost'}:${process.env.AUTH_DB_PORT || '5432'}/${process.env.AUTH_DB_NAME || 'auth_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
};
