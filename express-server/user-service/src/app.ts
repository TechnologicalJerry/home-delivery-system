import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('user-service');

export const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
  const redisHealthy = await redisClient.healthCheck();
  res.status(200).json({
    success: true,
    service: 'user-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      redis: redisHealthy,
    },
  });
});

// Routes
app.use('/users', userRoutes);

// Error handling
app.use(errorMiddleware);

// Initialize connections
export const initializeService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('User Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize User Service', error);
    throw error;
  }
};
