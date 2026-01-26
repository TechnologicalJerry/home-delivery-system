import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('auth-service');

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
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      redis: redisHealthy,
    },
  });
});

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use(errorMiddleware);

// Initialize connections
export const initializeService = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('Auth Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Auth Service', error);
    throw error;
  }
};
