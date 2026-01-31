import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { z } from 'zod';

const cartService = new CartService();

const getUserId = (req: Request): string => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) throw new Error('User ID not found');
  return userId;
};

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  name: z.string().optional(),
});

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const cart = await cartService.getCart(userId);

    res.json({
      success: true,
      data: cart || { userId, items: [], total: 0, updatedAt: new Date().toISOString() },
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

export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const validated = addItemSchema.parse(req.body);
    const cart = await cartService.addItem(userId, validated);

    res.json({
      success: true,
      data: cart,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors },
        timestamp: new Date().toISOString(),
      });
    }
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Quantity must be positive' },
        timestamp: new Date().toISOString(),
      });
    }

    const cart = await cartService.updateItem(userId, itemId, quantity);
    res.json({
      success: true,
      data: cart,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    const cart = await cartService.removeItem(userId, itemId);

    res.json({
      success: true,
      data: cart,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    await cartService.clearCart(userId);

    res.json({
      success: true,
      message: 'Cart cleared',
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
