import { PrismaClient, OrderStatus } from '@prisma/client';
import { OrderProducer } from '../events/producers/order.producer';
import axios from 'axios';
import { config } from '../config';
import { createLogger } from '@home-delivery/shared';
import { OrderCreatedEvent } from '@home-delivery/shared';

const logger = createLogger('order-service');
const prisma = new PrismaClient();
const orderProducer = new OrderProducer();

export interface CreateOrderInput {
  userId: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
}

export class OrderService {
  async createOrder(input: CreateOrderInput): Promise<any> {
    // Get cart from cart service
    const cartResponse = await axios.get(
      `${config.services.cart}/cart`,
      { headers: { 'x-user-id': input.userId } }
    );
    const cart = cartResponse.data.data;

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Reserve inventory
    for (const item of cart.items) {
      const inventoryResponse = await axios.post(
        `${config.services.inventory}/inventory/${item.productId}/reserve`,
        { quantity: item.quantity }
      );
      if (!inventoryResponse.data.success) {
        throw new Error(`Insufficient inventory for product ${item.productId}`);
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: input.userId,
        status: OrderStatus.PENDING,
        items: cart.items,
        totalAmount: cart.total,
        deliveryAddress: input.deliveryAddress,
      },
    });

    // Publish event
    const event: OrderCreatedEvent = {
      orderId: order.id,
      userId: order.userId,
      items: cart.items,
      totalAmount: order.totalAmount,
      deliveryAddress: JSON.stringify(input.deliveryAddress),
      createdAt: order.createdAt.toISOString(),
    };
    await orderProducer.publishOrderCreated(event);

    // Clear cart
    await axios.delete(`${config.services.cart}/cart`, {
      headers: { 'x-user-id': input.userId },
    });

    logger.info('Order created', { orderId: order.id, userId: order.userId });

    return order;
  }

  async getOrders(userId: string): Promise<any[]> {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(orderId: string, userId: string): Promise<any> {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async cancelOrder(orderId: string, userId: string, reason: string): Promise<any> {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new Error('Cannot cancel order in current status');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    // Release inventory
    const items = order.items as any[];
    for (const item of items) {
      await axios.post(
        `${config.services.inventory}/inventory/${item.productId}/release`,
        { quantity: item.quantity }
      );
    }

    // Publish event
    await orderProducer.publishOrderCancelled({
      orderId: order.id,
      userId: order.userId,
      reason,
      cancelledAt: new Date().toISOString(),
    });

    return updated;
  }
}
