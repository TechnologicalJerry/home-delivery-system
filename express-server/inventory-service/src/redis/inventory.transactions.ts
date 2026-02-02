// Redis transactions and pipelining for inventory operations
import { redisClient } from '@home-delivery/shared';
import { REDIS_KEYS, CACHE_TTL } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('inventory-transactions');

export class InventoryTransactions {
  /**
   * Reserve inventory using Redis transaction (MULTI/EXEC)
   * Ensures atomicity when multiple services try to reserve the same product
   */
  async reserveInventory(
    productId: string,
    quantity: number
  ): Promise<{ success: boolean; available: number }> {
    const client = redisClient.getClient();
    const key = REDIS_KEYS.INVENTORY(productId);

    try {
      // Use WATCH for optimistic locking
      await client.watch(key);

      // Get current inventory
      const current = await client.get(key);
      const currentQty = current ? parseInt(current, 10) : 0;

      if (currentQty < quantity) {
        await client.unwatch();
        return { success: false, available: currentQty };
      }

      // Start transaction
      const multi = client.multi();
      multi.decrBy(key, quantity);
      const results = await multi.exec();

      if (results === null) {
        // Transaction failed (key was modified)
        logger.warn('Inventory reservation transaction failed', { productId });
        return { success: false, available: currentQty };
      }

      const newQty = currentQty - quantity;
      logger.info('Inventory reserved', { productId, quantity, remaining: newQty });

      return { success: true, available: newQty };
    } catch (error) {
      logger.error('Error reserving inventory', error, { productId });
      throw error;
    }
  }

  /**
   * Release reserved inventory (rollback)
   */
  async releaseInventory(productId: string, quantity: number): Promise<void> {
    const client = redisClient.getClient();
    const key = REDIS_KEYS.INVENTORY(productId);

    try {
      await client.incrBy(key, quantity);
      logger.info('Inventory released', { productId, quantity });
    } catch (error) {
      logger.error('Error releasing inventory', error, { productId });
      throw error;
    }
  }

  /**
   * Get inventory using pipelining for multiple products
   */
  async getInventoryBatch(productIds: string[]): Promise<Record<string, number>> {
    const client = redisClient.getClient();
    const pipeline = client.multi();

    productIds.forEach(id => {
      pipeline.get(REDIS_KEYS.INVENTORY(id));
    });

    const results = await pipeline.exec();
    const inventory: Record<string, number> = {};

    if (results) {
      productIds.forEach((id, index) => {
        const result = results[index];
        if (result && typeof result === 'string') {
          inventory[id] = parseInt(result, 10);
        } else {
          inventory[id] = 0;
        }
      });
    }

    return inventory;
  }

  /**
   * Update inventory cache (write-through pattern)
   */
  async updateInventoryCache(productId: string, quantity: number): Promise<void> {
    const client = redisClient.getClient();
    const key = REDIS_KEYS.INVENTORY(productId);

    try {
      await client.setEx(key, CACHE_TTL.INVENTORY, quantity.toString());
      logger.debug('Inventory cache updated', { productId, quantity });
    } catch (error) {
      logger.error('Error updating inventory cache', error, { productId });
    }
  }
}
