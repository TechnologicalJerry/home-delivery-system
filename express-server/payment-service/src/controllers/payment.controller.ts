import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { z } from 'zod';

const paymentService = new PaymentService();

const getUserId = (req: Request): string => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) throw new Error('User ID not found');
  return userId;
};

const createPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.string(),
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const validated = createPaymentSchema.parse(req.body);
    const payment = await paymentService.createPayment({ userId, ...validated });

    res.status(201).json({
      success: true,
      data: payment,
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
      error: { code: 'PAYMENT_FAILED', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getPayment = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const payment = await paymentService.getPayment(id, userId);

    res.json({
      success: true,
      data: payment,
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

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    await paymentService.handleWebhook(req.body);
    res.json({ received: true });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'WEBHOOK_ERROR', message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
