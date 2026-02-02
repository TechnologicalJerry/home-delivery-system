import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

const inventoryService = new InventoryService();

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const inventory = await inventoryService.getInventory(productId);

    res.json({
      success: true,
      data: inventory,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
