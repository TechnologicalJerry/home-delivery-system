import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.ANALYTICS_SERVICE_PORT || '3010', 10),
  mongodb: {
    uri: process.env.ANALYTICS_MONGODB_URI || 'mongodb://admin:admin@mongodb-analytics:27017/analytics?authSource=admin',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
};
