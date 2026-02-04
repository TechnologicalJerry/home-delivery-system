// Catalog caching for products
import { redisClient } from '@home-delivery/shared';
import { REDIS_KEYS, CACHE_TTL } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('product-cache');

export interface CachedProduct {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ProductCache {
  // Cache entire catalog
  async getCatalog(): Promise<CachedProduct[] | null> {
    try {
      const client = redisClient.getClient();
      const cached = await client.get(REDIS_KEYS.PRODUCT_CATALOG);
      
      if (cached) {
        logger.debug('Cache hit for product catalog');
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      logger.error('Error reading catalog from cache', error);
      return null;
    }
  }

  async setCatalog(products: CachedProduct[]): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.setEx(
        REDIS_KEYS.PRODUCT_CATALOG,
        CACHE_TTL.PRODUCT_CATALOG,
        JSON.stringify(products)
      );
      logger.debug('Product catalog cached');
    } catch (error) {
      logger.error('Error caching catalog', error);
    }
  }

  // Cache individual product
  async getProduct(productId: string): Promise<CachedProduct | null> {
    try {
      const client = redisClient.getClient();
      const cached = await client.get(REDIS_KEYS.PRODUCT_DETAIL(productId));
      
      if (cached) {
        logger.debug('Cache hit for product', { productId });
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      logger.error('Error reading product from cache', error, { productId });
      return null;
    }
  }

  async setProduct(product: CachedProduct): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.setEx(
        REDIS_KEYS.PRODUCT_DETAIL(product.id),
        CACHE_TTL.PRODUCT_DETAIL,
        JSON.stringify(product)
      );
      logger.debug('Product cached', { productId: product.id });
    } catch (error) {
      logger.error('Error caching product', error, { productId: product.id });
    }
  }

  async invalidateCatalog(): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.del(REDIS_KEYS.PRODUCT_CATALOG);
      logger.debug('Product catalog cache invalidated');
    } catch (error) {
      logger.error('Error invalidating catalog cache', error);
    }
  }

  async invalidateProduct(productId: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.del(REDIS_KEYS.PRODUCT_DETAIL(productId));
      logger.debug('Product cache invalidated', { productId });
    } catch (error) {
      logger.error('Error invalidating product cache', error, { productId });
    }
  }
}
