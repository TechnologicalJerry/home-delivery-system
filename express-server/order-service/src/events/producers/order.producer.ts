// Event producer for order events (using Redis Streams as Kafka alternative)
import { redisClient } from '@home-delivery/shared';
import { REDIS_STREAMS, OrderEventType, OrderCreatedEvent, OrderConfirmedEvent, OrderCancelledEvent, OrderDeliveredEvent } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('order-producer');

export class OrderProducer {
  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.ORDERS,
        '*',
        {
          type: OrderEventType.ORDER_CREATED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Order created event published', { orderId: event.orderId });
    } catch (error) {
      logger.error('Failed to publish order created event', error);
      throw error;
    }
  }

  async publishOrderConfirmed(event: OrderConfirmedEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.ORDERS,
        '*',
        {
          type: OrderEventType.ORDER_CONFIRMED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Order confirmed event published', { orderId: event.orderId });
    } catch (error) {
      logger.error('Failed to publish order confirmed event', error);
      throw error;
    }
  }

  async publishOrderCancelled(event: OrderCancelledEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.ORDERS,
        '*',
        {
          type: OrderEventType.ORDER_CANCELLED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Order cancelled event published', { orderId: event.orderId });
    } catch (error) {
      logger.error('Failed to publish order cancelled event', error);
      throw error;
    }
  }

  async publishOrderDelivered(event: OrderDeliveredEvent): Promise<void> {
    try {
      const client = redisClient.getClient();
      await client.xAdd(
        REDIS_STREAMS.ORDERS,
        '*',
        {
          type: OrderEventType.ORDER_DELIVERED,
          data: JSON.stringify(event),
        }
      );
      logger.info('Order delivered event published', { orderId: event.orderId });
    } catch (error) {
      logger.error('Failed to publish order delivered event', error);
      throw error;
    }
  }
}
