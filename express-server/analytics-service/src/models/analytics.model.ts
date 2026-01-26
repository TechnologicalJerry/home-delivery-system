// Analytics data models
export interface OrderAnalytics {
  orderId: string;
  userId: string;
  totalAmount: number;
  itemCount: number;
  category: string;
  timestamp: Date;
}

export interface PaymentAnalytics {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  status: string;
  timestamp: Date;
}

export interface DeliveryAnalytics {
  deliveryId: string;
  orderId: string;
  duration: number; // minutes
  distance: number; // km
  timestamp: Date;
}
