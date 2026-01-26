import { Request, Response, NextFunction } from 'express';
import { redisClient } from '@home-delivery/shared';
import { config } from '../config';

const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const client = redisClient.getClient();
    const key = `rate_limit:${req.ip}:${req.path}`;
    
    const current = await client.incr(key);
    
    if (current === 1) {
      await client.expire(key, RATE_LIMIT_WINDOW);
    }

    if (current > RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Limit: ${RATE_LIMIT_MAX_REQUESTS} per ${RATE_LIMIT_WINDOW}s`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - current).toString());
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + RATE_LIMIT_WINDOW * 1000).toISOString());

    next();
  } catch (error) {
    // If Redis fails, allow the request (fail open)
    console.error('Rate limit error:', error);
    next();
  }
};
