import { PrismaClient, PaymentStatus } from '@prisma/client';
import { PaymentProducer } from '../events/producers/payment.producer';
import { config } from '../config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('payment-service');
const prisma = new PrismaClient();
const paymentProducer = new PaymentProducer();

export interface CreatePaymentInput {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
}

export class PaymentService {
  async createPayment(input: CreatePaymentInput): Promise<any> {
    const payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        userId: input.userId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        status: PaymentStatus.PENDING,
      },
    });

    // Publish event
    await paymentProducer.publishPaymentInitiated({
      paymentId: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      initiatedAt: payment.createdAt.toISOString(),
    });

    // Simulate payment processing (in production, integrate with Stripe/PayPal)
    // For demo, we'll auto-approve after a delay
    setTimeout(async () => {
      await this.processPayment(payment.id, true);
    }, 2000);

    return payment;
  }

  async processPayment(paymentId: string, success: boolean): Promise<void> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (success) {
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.SUCCESS,
          transactionId: `txn_${Date.now()}`,
        },
      });

      await paymentProducer.publishPaymentSuccess({
        paymentId: updated.id,
        orderId: updated.orderId,
        userId: updated.userId,
        amount: updated.amount,
        transactionId: updated.transactionId!,
        completedAt: updated.updatedAt.toISOString(),
      });
    } else {
      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.FAILED },
      });

      await paymentProducer.publishPaymentFailed({
        paymentId: updated.id,
        orderId: updated.orderId,
        userId: updated.userId,
        amount: updated.amount,
        reason: 'Payment processing failed',
        failedAt: updated.updatedAt.toISOString(),
      });
    }
  }

  async getPayment(paymentId: string, userId: string): Promise<any> {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, userId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async handleWebhook(payload: any): Promise<void> {
    // Handle Stripe webhook events
    logger.info('Webhook received', { type: payload.type });
    // Implement webhook handling logic
  }
}
