// Payment event producer using Redis Streams
import { redisClient } from '@home-delivery/shared';
import { REDIS_STREAMS, PaymentEventType, PaymentInitiatedEvent, PaymentSuccessEvent, PaymentFailedEvent, PaymentRefundedEvent } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('payment-producer');

export class PaymentProducer {
  async publishPaymentInitiated(event: PaymentInitiatedEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.PAYMENTS,
        '*',
        {
          type: PaymentEventType.PAYMENT_INITIATED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Payment initiated event published', { paymentId: event.paymentId });
    } catch (error) {
      logger.error('Failed to publish payment initiated event', error);
      throw error;
    }
  }

  async publishPaymentSuccess(event: PaymentSuccessEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.PAYMENTS,
        '*',
        {
          type: PaymentEventType.PAYMENT_SUCCESS,
          data: JSON.stringify(event),
        }
      );
      logger.info('Payment success event published', { paymentId: event.paymentId });
    } catch (error) {
      logger.error('Failed to publish payment success event', error);
      throw error;
    }
  }

  async publishPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.PAYMENTS,
        '*',
        {
          type: PaymentEventType.PAYMENT_FAILED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Payment failed event published', { paymentId: event.paymentId });
    } catch (error) {
      logger.error('Failed to publish payment failed event', error);
      throw error;
    }
  }

  async publishPaymentRefunded(event: PaymentRefundedEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.PAYMENTS,
        '*',
        {
          type: PaymentEventType.PAYMENT_REFUNDED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Payment refunded event published', { paymentId: event.paymentId });
    } catch (error) {
      logger.error('Failed to publish payment refunded event', error);
      throw error;
    }
  }
}
