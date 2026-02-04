// Payment-related event contracts
export enum PaymentEventType {
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
}

export interface PaymentInitiatedEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  initiatedAt: string;
}

export interface PaymentSuccessEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  transactionId: string;
  completedAt: string;
}

export interface PaymentFailedEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
  failedAt: string;
}

export interface PaymentRefundedEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  refundId: string;
  refundedAt: string;
}
