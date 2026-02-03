import { app, initializeService } from './app';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('order-service');

const startServer = async () => {
  try {
    await initializeService();
    app.listen(config.port, () => {
      logger.info(`Order Service running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start Order Service', error);
    process.exit(1);
  }
};

startServer();
