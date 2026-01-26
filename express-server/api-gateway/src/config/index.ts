import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.API_GATEWAY_PORT || '3000', 10),
  jwtSecret: process.env.API_GATEWAY_JWT_SECRET || 'default-secret-change-me',
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    user: process.env.USER_SERVICE_URL || 'http://user-service:3002',
    product: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003',
    inventory: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3004',
    cart: process.env.CART_SERVICE_URL || 'http://cart-service:3005',
    order: process.env.ORDER_SERVICE_URL || 'http://order-service:3006',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3007',
    delivery: process.env.DELIVERY_SERVICE_URL || 'http://delivery-service:3008',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
};
