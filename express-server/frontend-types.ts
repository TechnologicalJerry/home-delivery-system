/**
 * TypeScript Types for Home Delivery System API
 * Copy this file to your Next.js project: types/api.ts
 */

// Common Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Auth Types
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  notifications?: boolean;
  language?: string;
  [key: string]: any;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface Inventory {
  quantity: number;
  available: number;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

// Order Types
export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: Address;
  paymentId?: string;
  deliveryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

// Payment Types
export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED';

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  refundId?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

// Delivery Types
export type DeliveryStatus = 
  | 'PENDING'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED';

export interface Delivery {
  id: string;
  orderId: string;
  deliveryAgentId?: string;
  status: DeliveryStatus;
  pickupLocation: {
    lat: number;
    lng: number;
  };
  deliveryLocation: {
    lat: number;
    lng: number;
  };
  currentLocation?: {
    lat: number;
    lng: number;
  };
  estimatedTime?: number;
  actualTime?: number;
  createdAt: string;
  updatedAt: string;
}
