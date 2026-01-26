import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';
import { AnalyticsConsumer } from './consumers/analytics.consumer';
import { AnalyticsProcessor } from './processors/analytics.processor';

const logger = createLogger('analytics-service');

const startService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Analytics Service initialized');

    const processor = new AnalyticsProcessor();
    await processor.connect();

    const consumer = new AnalyticsConsumer(processor);
    await consumer.start();

    logger.info('Analytics Service running');
  } catch (error) {
    logger.error('Failed to start Analytics Service', error);
    process.exit(1);
  }
};

startService();
