import { httpServer, initializeService, trackingServer } from './app';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('delivery-service');

const startServer = async () => {
  try {
    await initializeService();
    httpServer.listen(config.port, () => {
      logger.info(`Delivery Service running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start Delivery Service', error);
    process.exit(1);
  }
};

startServer();
