import { PrismaClient } from '@prisma/client';
import { UserCache, CachedUserProfile } from '../cache/user.cache';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('user-service');
const prisma = new PrismaClient();
const userCache = new UserCache();

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  preferences?: {
    notifications?: boolean;
    language?: string;
    [key: string]: any;
  };
}

export class UserService {
  /**
   * Get user profile using cache-aside pattern
   * 1. Check cache first
   * 2. If miss, fetch from DB
   * 3. Populate cache for future requests
   */
  async getUserProfile(userId: string): Promise<CachedUserProfile | null> {
    // Try cache first (cache-aside pattern)
    let profile = await userCache.getUserProfile(userId);

    if (!profile) {
      // Cache miss - fetch from database
      const dbProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!dbProfile) {
        return null;
      }

      profile = {
        id: dbProfile.id,
        userId: dbProfile.userId,
        firstName: dbProfile.firstName || undefined,
        lastName: dbProfile.lastName || undefined,
        phone: dbProfile.phone || undefined,
        address: dbProfile.address as any,
        preferences: dbProfile.preferences as any,
        createdAt: dbProfile.createdAt.toISOString(),
        updatedAt: dbProfile.updatedAt.toISOString(),
      };

      // Populate cache for future requests
      await userCache.setUserProfile(userId, profile);
    }

    return profile;
  }

  /**
   * Update user profile
   * 1. Update database
   * 2. Invalidate cache (write-through would update cache, but cache-aside invalidates)
   */
  async updateUserProfile(
    userId: string,
    input: UpdateUserProfileInput
  ): Promise<CachedUserProfile> {
    // Update database
    const updated = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        address: input.address,
        preferences: input.preferences,
        updatedAt: new Date(),
      },
      create: {
        userId,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        address: input.address,
        preferences: input.preferences,
      },
    });

    // Invalidate cache (cache-aside pattern)
    await userCache.invalidateUserProfile(userId);

    logger.info('User profile updated', { userId });

    const profile: CachedUserProfile = {
      id: updated.id,
      userId: updated.userId,
      firstName: updated.firstName || undefined,
      lastName: updated.lastName || undefined,
      phone: updated.phone || undefined,
      address: updated.address as any,
      preferences: updated.preferences as any,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    return profile;
  }
}
