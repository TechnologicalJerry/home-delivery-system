// Order-related event contracts
export enum OrderEventType {
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_FAILED = 'order.failed',
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
}

export interface OrderConfirmedEvent {
  orderId: string;
  userId: string;
  confirmedAt: string;
}

export interface OrderCancelledEvent {
  orderId: string;
  userId: string;
  reason: string;
  cancelledAt: string;
}

export interface OrderDeliveredEvent {
  orderId: string;
  userId: string;
  deliveredAt: string;
  deliveryAgentId: string;
}

export interface OrderFailedEvent {
  orderId: string;
  userId: string;
  reason: string;
  failedAt: string;
}
