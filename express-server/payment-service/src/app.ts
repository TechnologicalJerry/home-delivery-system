import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import paymentRoutes from './routes/payment.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('payment-service');
export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/json' })); // For webhook signature verification

app.get('/health', async (req, res) => {
  const redisHealthy = await redisClient.healthCheck();
  res.status(200).json({
    success: true,
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    dependencies: { redis: redisHealthy },
  });
});

app.use('/payments', paymentRoutes);
app.use(errorMiddleware);

export const initializeService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Payment Service initialized');
  } catch (error) {
    logger.error('Failed to initialize Payment Service', error);
    throw error;
  }
};
