import { PrismaClient } from '@prisma/client';
import { InventoryTransactions } from '../redis/inventory.transactions';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('inventory-service');
const prisma = new PrismaClient();
const inventoryTx = new InventoryTransactions();

export class InventoryService {
  async getInventory(productId: string): Promise<{ quantity: number; available: number }> {
    // Try Redis cache first
    const cached = await inventoryTx.getInventoryBatch([productId]);
    
    if (cached[productId] !== undefined) {
      return {
        quantity: cached[productId],
        available: cached[productId],
      };
    }

    // Cache miss - fetch from DB and update cache
    const dbInventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    const quantity = dbInventory?.quantity || 0;
    await inventoryTx.updateInventoryCache(productId, quantity);

    return {
      quantity,
      available: quantity,
    };
  }

  async reserveInventory(productId: string, quantity: number): Promise<boolean> {
    // Use Redis transaction for atomic reservation
    const result = await inventoryTx.reserveInventory(productId, quantity);

    if (result.success) {
      // Update database (eventual consistency)
      await prisma.inventory.update({
        where: { productId },
        data: {
          quantity: { decrement: quantity },
          reserved: { increment: quantity },
        },
      }).catch(err => {
        logger.error('Failed to update DB after reservation', err, { productId });
        // Rollback Redis
        inventoryTx.releaseInventory(productId, quantity);
      });
    }

    return result.success;
  }

  async releaseInventory(productId: string, quantity: number): Promise<void> {
    await inventoryTx.releaseInventory(productId, quantity);
    
    await prisma.inventory.update({
      where: { productId },
      data: {
        quantity: { increment: quantity },
        reserved: { decrement: quantity },
      },
    });
  }
}
