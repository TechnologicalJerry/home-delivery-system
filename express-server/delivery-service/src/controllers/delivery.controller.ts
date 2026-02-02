import { Request, Response } from 'express';
import { DeliveryService } from '../services/delivery.service';

const deliveryService = new DeliveryService();

export const trackDelivery = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const delivery = await deliveryService.getDelivery(orderId);

    res.json({
      success: true,
      data: delivery,
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
