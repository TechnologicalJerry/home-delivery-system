// Cache-aside pattern implementation for user profiles
import { redisClient } from '@home-delivery/shared';
import { REDIS_KEYS, CACHE_TTL } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('user-cache');

export interface CachedUserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: any;
  preferences?: any;
  createdAt: string;
  updatedAt: string;
}

export class UserCache {
  /**
   * Cache-aside pattern: Try cache first, if miss, fetch from DB and populate cache
   */
  async getUserProfile(userId: string): Promise<CachedUserProfile | null> {
    try {
      const client = redisClient.getClient();
      const cacheKey = REDIS_KEYS.USER_PROFILE(userId);
      
      // Try to get from cache
      const cached = await client.get(cacheKey);
      
      if (cached) {
        logger.debug('Cache hit for user profile', { userId });
        return JSON.parse(cached);
      }

      logger.debug('Cache miss for user profile', { userId });
      return null;
    } catch (error) {
      logger.error('Error reading from cache', error, { userId });
      // Fail open - return null to allow DB lookup
      return null;
    }
  }

  /**
   * Set user profile in cache
   */
  async setUserProfile(userId: string, profile: CachedUserProfile): Promise<void> {
    try {
      const client = redisClient.getClient();
      const cacheKey = REDIS_KEYS.USER_PROFILE(userId);
      
      await client.setEx(
        cacheKey,
        CACHE_TTL.USER_PROFILE,
        JSON.stringify(profile)
      );

      logger.debug('User profile cached', { userId });
    } catch (error) {
      logger.error('Error writing to cache', error, { userId });
      // Fail silently - cache is not critical
    }
  }

  /**
   * Invalidate user profile cache
   */
  async invalidateUserProfile(userId: string): Promise<void> {
    try {
      const client = redisClient.getClient();
      const cacheKey = REDIS_KEYS.USER_PROFILE(userId);
      
      await client.del(cacheKey);
      logger.debug('User profile cache invalidated', { userId });
    } catch (error) {
      logger.error('Error invalidating cache', error, { userId });
    }
  }
}
