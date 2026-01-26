// Analytics event consumer
import { redisClient } from '@home-delivery/shared';
import { REDIS_STREAMS, OrderEventType, PaymentEventType, DeliveryEventType } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';
import { AnalyticsProcessor } from '../processors/analytics.processor';

const logger = createLogger('analytics-consumer');

export class AnalyticsConsumer {
  private processor: AnalyticsProcessor;
  private consumerGroup = 'analytics-group';
  private isRunning = false;

  constructor(processor: AnalyticsProcessor) {
    this.processor = processor;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    logger.info('Starting analytics consumer');

    try {
      const client = redisClient.getClient();
      await client.xGroupCreate(
        REDIS_STREAMS.ORDERS,
        this.consumerGroup,
        '0',
        { mkstream: true }
      );
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        logger.error('Failed to create consumer group', error);
      }
    }

    this.consumeOrders();
    this.consumePayments();
    this.consumeDeliveries();
  }

  private async consumeOrders(): Promise<void> {
    const client = redisClient.getClient();
    
    while (this.isRunning) {
      try {
        const messages = await client.xReadGroup(
          this.consumerGroup,
          'analytics-worker',
          [
            {
              key: REDIS_STREAMS.ORDERS,
              id: '>',
            }
          ],
          {
            COUNT: 10,
            BLOCK: 5000,
          }
        );

        if (messages) {
          for (const stream of messages) {
            for (const message of stream.messages) {
              await this.processOrderEvent(message);
              await client.xAck(
                REDIS_STREAMS.ORDERS,
                this.consumerGroup,
                message.id
              );
            }
          }
        }
      } catch (error) {
        logger.error('Error consuming order events', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async consumePayments(): Promise<void> {
    const client = redisClient.getClient();
    
    while (this.isRunning) {
      try {
        const messages = await client.xReadGroup(
          this.consumerGroup,
          'analytics-worker',
          [
            {
              key: REDIS_STREAMS.PAYMENTS,
              id: '>',
            }
          ],
          {
            COUNT: 10,
            BLOCK: 5000,
          }
        );

        if (messages) {
          for (const stream of messages) {
            for (const message of stream.messages) {
              await this.processPaymentEvent(message);
              await client.xAck(
                REDIS_STREAMS.PAYMENTS,
                this.consumerGroup,
                message.id
              );
            }
          }
        }
      } catch (error) {
        logger.error('Error consuming payment events', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async consumeDeliveries(): Promise<void> {
    const client = redisClient.getClient();
    
    while (this.isRunning) {
      try {
        const messages = await client.xReadGroup(
          this.consumerGroup,
          'analytics-worker',
          [
            {
              key: REDIS_STREAMS.DELIVERIES,
              id: '>',
            }
          ],
          {
            COUNT: 10,
            BLOCK: 5000,
          }
        );

        if (messages) {
          for (const stream of messages) {
            for (const message of stream.messages) {
              await this.processDeliveryEvent(message);
              await client.xAck(
                REDIS_STREAMS.DELIVERIES,
                this.consumerGroup,
                message.id
              );
            }
          }
        }
      } catch (error) {
        logger.error('Error consuming delivery events', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async processOrderEvent(message: any): Promise<void> {
    try {
      const eventType = message.message.type;
      const eventData = JSON.parse(message.message.data);

      if (eventType === OrderEventType.ORDER_CREATED) {
        await this.processor.processOrderCreated(eventData);
      }
    } catch (error) {
      logger.error('Error processing order event', error);
    }
  }

  private async processPaymentEvent(message: any): Promise<void> {
    try {
      const eventType = message.message.type;
      const eventData = JSON.parse(message.message.data);

      if (eventType === PaymentEventType.PAYMENT_SUCCESS) {
        await this.processor.processPaymentSuccess(eventData);
      }
    } catch (error) {
      logger.error('Error processing payment event', error);
    }
  }

  private async processDeliveryEvent(message: any): Promise<void> {
    try {
      const eventType = message.message.type;
      const eventData = JSON.parse(message.message.data);

      if (eventType === DeliveryEventType.DELIVERY_COMPLETED) {
        await this.processor.processDeliveryCompleted(eventData);
      }
    } catch (error) {
      logger.error('Error processing delivery event', error);
    }
  }

  stop(): void {
    this.isRunning = false;
  }
}
