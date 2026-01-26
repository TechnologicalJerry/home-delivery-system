// Analytics data processor
import { MongoClient } from 'mongodb';
import { config } from '../config';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('analytics-processor');

export class AnalyticsProcessor {
  private client: MongoClient;
  private db: any;

  constructor() {
    this.client = new MongoClient(config.mongodb.uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db('analytics');
    logger.info('Connected to MongoDB');
  }

  async processOrderCreated(orderData: any): Promise<void> {
    try {
      await this.db.collection('orders').insertOne({
        orderId: orderData.orderId,
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
        itemCount: orderData.items?.length || 0,
        timestamp: new Date(orderData.createdAt),
      });
      logger.info('Order analytics recorded', { orderId: orderData.orderId });
    } catch (error) {
      logger.error('Error processing order analytics', error);
    }
  }

  async processPaymentSuccess(paymentData: any): Promise<void> {
    try {
      await this.db.collection('payments').insertOne({
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        status: 'success',
        timestamp: new Date(paymentData.completedAt),
      });
      logger.info('Payment analytics recorded', { paymentId: paymentData.paymentId });
    } catch (error) {
      logger.error('Error processing payment analytics', error);
    }
  }

  async processDeliveryCompleted(deliveryData: any): Promise<void> {
    try {
      await this.db.collection('deliveries').insertOne({
        deliveryId: deliveryData.deliveryId,
        orderId: deliveryData.orderId,
        timestamp: new Date(deliveryData.completedAt),
      });
      logger.info('Delivery analytics recorded', { deliveryId: deliveryData.deliveryId });
    } catch (error) {
      logger.error('Error processing delivery analytics', error);
    }
  }
}
