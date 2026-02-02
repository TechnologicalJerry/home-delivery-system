// Event consumer using Redis Streams
import { redisClient } from '@home-delivery/shared';
import { REDIS_STREAMS, OrderEventType, PaymentEventType, DeliveryEventType } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';
import { NotificationService } from '../services/notification.service';

const logger = createLogger('notification-consumer');

export class EventConsumer {
  private notificationService: NotificationService;
  private consumerGroup = 'notification-group';
  private isRunning = false;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    logger.info('Starting event consumer');

    // Create consumer group if it doesn't exist
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

    // Start consuming
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
          'notification-worker',
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
              await this.handleOrderEvent(message);
              // Acknowledge message
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
          'notification-worker',
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
              await this.handlePaymentEvent(message);
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
          'notification-worker',
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
              await this.handleDeliveryEvent(message);
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

  private async handleOrderEvent(message: any): Promise<void> {
    try {
      const eventType = message.message.type;
      const eventData = JSON.parse(message.message.data);

      switch (eventType) {
        case OrderEventType.ORDER_CREATED:
          await this.notificationService.sendOrderConfirmation(eventData.userId, eventData);
          break;
        case OrderEventType.ORDER_DELIVERED:
          await this.notificationService.sendDeliveryConfirmation(eventData.userId, eventData);
          break;
      }
    } catch (error) {
      logger.error('Error handling order event', error);
    }
  }

  private async handlePaymentEvent(message: any): Promise<void> {
    try {
      const eventType = message.message.type;
      const eventData = JSON.parse(message.message.data);

      switch (eventType) {
        case PaymentEventType.PAYMENT_SUCCESS:
          await this.notificationService.sendPaymentConfirmation(eventData.userId, eventData);
          break;
        case PaymentEventType.PAYMENT_FAILED:
          await this.notificationService.sendPaymentFailure(eventData.userId, eventData);
          break;
      }
    } catch (error) {
      logger.error('Error handling payment event', error);
    }
  }

  private async handleDeliveryEvent(message: any): Promise<void> {
    try {
      const eventType = message.message.type;
      const eventData = JSON.parse(message.message.data);

      switch (eventType) {
        case DeliveryEventType.DELIVERY_IN_TRANSIT:
          await this.notificationService.sendDeliveryUpdate(eventData.userId, eventData);
          break;
      }
    } catch (error) {
      logger.error('Error handling delivery event', error);
    }
  }

  stop(): void {
    this.isRunning = false;
  }
}
