// Redis client singleton
import { createClient, RedisClientType } from 'redis';
import { createLogger } from '../logger';

const logger = createLogger('redis-client');

class RedisClient {
  private client: RedisClientType | null = null;
  private isConnected = false;

  async connect(config: { host: string; port: number; password?: string; db?: number }) {
    if (this.isConnected && this.client) {
      return this.client;
    }

    try {
      this.client = createClient({
        socket: {
          host: config.host,
          port: config.port,
        },
        password: config.password,
        database: config.db || 0,
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error', err);
      });

      this.client.on('connect', () => {
        logger.info('Redis client connecting...');
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
        this.isConnected = true;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  getClient(): RedisClientType {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client not connected. Call connect() first.');
    }
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      this.client = null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) {
        return false;
      }
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export const redisClient = new RedisClient();
