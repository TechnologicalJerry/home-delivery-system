import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.INVENTORY_SERVICE_PORT || '3004', 10),
  database: {
    url: process.env.INVENTORY_DATABASE_URL || `postgresql://${process.env.INVENTORY_DB_USER || 'postgres'}:${process.env.INVENTORY_DB_PASSWORD || 'postgres'}@${process.env.INVENTORY_DB_HOST || 'localhost'}:${process.env.INVENTORY_DB_PORT || '5432'}/${process.env.INVENTORY_DB_NAME || 'inventory_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'inventory-service',
    groupId: process.env.KAFKA_GROUP_ID || 'inventory-consumers',
  },
};
