// Cart stored entirely in Redis
import { redisClient } from '@home-delivery/shared';
import { REDIS_KEYS, CACHE_TTL } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('cart-repository');

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: string;
}

export class CartRepository {
  async getCart(userId: string): Promise<Cart | null> {
    try {
      const client = redisClient.getClient();
      const cartKey = REDIS_KEYS.CART(userId);
      const cartData = await client.get(cartKey);

      if (!cartData) {
        return null;
      }

      return JSON.parse(cartData);
    } catch (error) {
      logger.error('Error getting cart', error, { userId });
      return null;
    }
  }

  async saveCart(cart: Cart): Promise<void> {
    try {
      const client = redisClient.getClient();
      const cartKey = REDIS_KEYS.CART(cart.userId);
      
      await client.setEx(
        cartKey,
        CACHE_TTL.CART,
        JSON.stringify(cart)
      );

      logger.debug('Cart saved', { userId: cart.userId });
    } catch (error) {
      logger.error('Error saving cart', error, { userId: cart.userId });
      throw error;
    }
  }

  async deleteCart(userId: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      const cartKey = REDIS_KEYS.CART(userId);
      await client.del(cartKey);
      logger.debug('Cart deleted', { userId });
    } catch (error) {
      logger.error('Error deleting cart', error, { userId });
      throw error;
    }
  }
}
