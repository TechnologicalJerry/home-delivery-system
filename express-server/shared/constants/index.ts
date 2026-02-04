// Shared constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CACHE_TTL = {
  USER_PROFILE: 3600, // 1 hour
  PRODUCT_CATALOG: 1800, // 30 minutes
  PRODUCT_DETAIL: 600, // 10 minutes
  CART: 86400, // 24 hours
  INVENTORY: 300, // 5 minutes
} as const;

export const REDIS_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  PRODUCT_CATALOG: 'product:catalog',
  PRODUCT_DETAIL: (productId: string) => `product:detail:${productId}`,
  CART: (userId: string) => `cart:${userId}`,
  INVENTORY: (productId: string) => `inventory:${productId}`,
  DELIVERY_AGENT: (agentId: string) => `delivery:agent:${agentId}`,
  DELIVERY_LOCATION: (deliveryId: string) => `delivery:location:${deliveryId}`,
} as const;

export const KAFKA_TOPICS = {
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  INVENTORY: 'inventory',
  DELIVERIES: 'deliveries',
  NOTIFICATIONS: 'notifications',
} as const;

export const REDIS_STREAMS = {
  ORDERS: 'stream:orders',
  PAYMENTS: 'stream:payments',
  INVENTORY: 'stream:inventory',
  DELIVERIES: 'stream:deliveries',
} as const;
