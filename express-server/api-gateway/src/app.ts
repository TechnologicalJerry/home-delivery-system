import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';
import { redisClient } from '@home-delivery/shared';
import { config } from './config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('api-gateway');

export const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimitMiddleware);

// Health check
app.get('/health', async (req, res) => {
  const redisHealthy = await redisClient.healthCheck();
  res.status(redisHealthy ? 200 : 503).json({
    success: redisHealthy,
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    dependencies: {
      redis: redisHealthy,
    },
  });
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

// Initialize Redis connection
export const initializeGateway = async () => {
  try {
    await redisClient.connect(config.redis);
    logger.info('API Gateway initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize API Gateway', error);
    throw error;
  }
};
