import { app, initializeService } from './app';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('auth-service');

const startServer = async () => {
  try {
    await initializeService();
    
    app.listen(config.port, () => {
      logger.info(`Auth Service running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start Auth Service', error);
    process.exit(1);
  }
};

startServer();
