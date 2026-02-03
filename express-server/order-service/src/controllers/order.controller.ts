import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { z } from 'zod';

const orderService = new OrderService();

const getUserId = (req: Request): string => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) throw new Error('User ID not found');
  return userId;
};

const createOrderSchema = z.object({
  deliveryAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const validated = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder({ userId, ...validated });

    res.status(201).json({
      success: true,
      data: order,
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
    res.status(400).json({
      success: false,
      error: { code: 'ORDER_FAILED', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const orders = await orderService.getOrders(userId);

    res.json({
      success: true,
      data: orders,
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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const order = await orderService.getOrder(id, userId);

    res.json({
      success: true,
      data: order,
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

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { reason } = req.body;
    const order = await orderService.cancelOrder(id, userId, reason || 'User cancelled');

    res.json({
      success: true,
      data: order,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'CANCEL_FAILED', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
