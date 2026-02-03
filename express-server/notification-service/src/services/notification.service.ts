import { EmailProvider } from '../providers/email.provider';
import { SMSProvider } from '../providers/sms.provider';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('notification-service');
const emailProvider = new EmailProvider();
const smsProvider = new SMSProvider();

export class NotificationService {
  async sendOrderConfirmation(userId: string, orderData: any): Promise<void> {
    const subject = 'Order Confirmed';
    const body = `Your order #${orderData.orderId} has been confirmed. Total: $${orderData.totalAmount}`;
    
    // In production, get user email from user service
    await emailProvider.sendEmail(`user${userId}@example.com`, subject, body);
    logger.info('Order confirmation sent', { userId, orderId: orderData.orderId });
  }

  async sendPaymentConfirmation(userId: string, paymentData: any): Promise<void> {
    const subject = 'Payment Successful';
    const body = `Your payment of $${paymentData.amount} for order #${paymentData.orderId} was successful.`;
    
    await emailProvider.sendEmail(`user${userId}@example.com`, subject, body);
    logger.info('Payment confirmation sent', { userId, paymentId: paymentData.paymentId });
  }

  async sendPaymentFailure(userId: string, paymentData: any): Promise<void> {
    const subject = 'Payment Failed';
    const body = `Your payment for order #${paymentData.orderId} failed. Please try again.`;
    
    await emailProvider.sendEmail(`user${userId}@example.com`, subject, body);
    await smsProvider.sendSMS(`+1234567890`, body); // Get from user profile
    logger.info('Payment failure notification sent', { userId });
  }

  async sendDeliveryConfirmation(userId: string, deliveryData: any): Promise<void> {
    const subject = 'Order Delivered';
    const body = `Your order #${deliveryData.orderId} has been delivered!`;
    
    await emailProvider.sendEmail(`user${userId}@example.com`, subject, body);
    await smsProvider.sendSMS(`+1234567890`, body);
    logger.info('Delivery confirmation sent', { userId, orderId: deliveryData.orderId });
  }

  async sendDeliveryUpdate(userId: string, deliveryData: any): Promise<void> {
    const message = `Your order is on the way! Current location updated.`;
    await smsProvider.sendSMS(`+1234567890`, message);
    logger.info('Delivery update sent', { userId });
  }
}
