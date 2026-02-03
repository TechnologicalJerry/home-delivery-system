import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.ORDER_SERVICE_PORT || '3006', 10),
  database: {
    url: process.env.ORDER_DATABASE_URL || `postgresql://${process.env.ORDER_DB_USER || 'postgres'}:${process.env.ORDER_DB_PASSWORD || 'postgres'}@${process.env.ORDER_DB_HOST || 'localhost'}:${process.env.ORDER_DB_PORT || '5432'}/${process.env.ORDER_DB_NAME || 'order_db'}`,
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  services: {
    inventory: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3004',
    cart: process.env.CART_SERVICE_URL || 'http://cart-service:3005',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3007',
  },
};
