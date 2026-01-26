import { app, initializeGateway } from './app';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('api-gateway');

const startServer = async () => {
  try {
    await initializeGateway();
    
    app.listen(config.port, () => {
      logger.info(`API Gateway running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start API Gateway', error);
    process.exit(1);
  }
};

startServer();
