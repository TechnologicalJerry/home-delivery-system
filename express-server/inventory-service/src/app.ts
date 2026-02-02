import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import inventoryRoutes from './routes/inventory.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('inventory-service');
export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  const redisHealthy = await redisClient.healthCheck();
  res.status(200).json({
    success: true,
    service: 'inventory-service',
    timestamp: new Date().toISOString(),
    dependencies: { redis: redisHealthy },
  });
});

app.use('/inventory', inventoryRoutes);
app.use(errorMiddleware);

export const initializeService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Inventory Service initialized');
  } catch (error) {
    logger.error('Failed to initialize Inventory Service', error);
    throw error;
  }
};
