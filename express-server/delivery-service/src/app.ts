import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import deliveryRoutes from './routes/delivery.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';
import { TrackingServer } from './socket/tracking.server';

const logger = createLogger('delivery-service');
export const app = express();
export const httpServer = createServer(app);

// Initialize Socket.io
export const trackingServer = new TrackingServer(httpServer);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  const redisHealthy = await redisClient.healthCheck();
  res.status(200).json({
    success: true,
    service: 'delivery-service',
    timestamp: new Date().toISOString(),
    dependencies: { redis: redisHealthy },
  });
});

app.use('/deliveries', deliveryRoutes);
app.use(errorMiddleware);

export const initializeService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Delivery Service initialized');
  } catch (error) {
    logger.error('Failed to initialize Delivery Service', error);
    throw error;
  }
};
