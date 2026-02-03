import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';
import { EventConsumer } from './consumers/event.consumer';
import { NotificationService } from './services/notification.service';

const logger = createLogger('notification-service');

const startService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Notification Service initialized');

    // Start event consumers
    const notificationService = new NotificationService();
    const consumer = new EventConsumer(notificationService);
    await consumer.start();

    logger.info('Notification Service running');
  } catch (error) {
    logger.error('Failed to start Notification Service', error);
    process.exit(1);
  }
};

startService();
