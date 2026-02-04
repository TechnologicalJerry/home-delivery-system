import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import productRoutes from './routes/product.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('product-service');

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  const redisHealthy = await redisClient.healthCheck();
  res.status(200).json({
    success: true,
    service: 'product-service',
    timestamp: new Date().toISOString(),
    dependencies: { redis: redisHealthy },
  });
});

app.use('/products', productRoutes);
app.use(errorMiddleware);

export const initializeService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Product Service initialized');
  } catch (error) {
    logger.error('Failed to initialize Product Service', error);
    throw error;
  }
};
