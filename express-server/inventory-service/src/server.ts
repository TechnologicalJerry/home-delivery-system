import { app, initializeService } from './app';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('inventory-service');

const startServer = async () => {
  try {
    await initializeService();
    app.listen(config.port, () => {
      logger.info(`Inventory Service running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start Inventory Service', error);
    process.exit(1);
  }
};

startServer();
