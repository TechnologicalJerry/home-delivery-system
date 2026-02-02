/**
 * API Client for Next.js Frontend
 * Copy this file to your Next.js project: lib/api-client.ts
 * 
 * Usage:
 * import { apiClient } from '@/lib/api-client';
 * const products = await apiClient.getProducts();
 */

import type {
  ApiResponse,
  RegisterRequest,
  LoginRequest,
  AuthTokens,
  User,
  Product,
  Inventory,
  Cart,
  AddToCartRequest,
  Order,
  CreateOrderRequest,
  Payment,
  CreatePaymentRequest,
  Delivery,
} from './frontend-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.message || 'Request failed',
        data.error?.code,
        response.status
      );
    }

    return data;
  }

  // ==================== AUTH ====================

  async register(email: string, password: string): Promise<ApiResponse<{ userId: string; email: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthTokens>> {
    const data = await this.request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.success && data.data?.accessToken) {
      this.setToken(data.data.accessToken);
      if (typeof window !== 'undefined' && data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
    }
    return data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const data = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    if (data.success && data.data?.accessToken) {
      this.setToken(data.data.accessToken);
      if (typeof window !== 'undefined' && data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
    }
    return data;
  }

  // ==================== USER ====================

  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile');
  }

  async updateUserProfile(profile: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // ==================== PRODUCTS ====================

  async getProducts(category?: string): Promise<ApiResponse<Product[]>> {
    const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    return this.request<Product[]>(url);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  // ==================== INVENTORY ====================

  async getInventory(productId: string): Promise<ApiResponse<Inventory>> {
    return this.request<Inventory>(`/inventory/${productId}`);
  }

  // ==================== CART ====================

  async getCart(): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart');
  }

  async addToCart(item: AddToCartRequest): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: string): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/cart', {
      method: 'DELETE',
    });
  }

  // ==================== ORDERS ====================

  async createOrder(deliveryAddress: CreateOrderRequest['deliveryAddress']): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ deliveryAddress }),
    });
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ==================== PAYMENTS ====================

  async createPayment(orderId: string, amount: number, paymentMethod: string): Promise<ApiResponse<Payment>> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, paymentMethod }),
    });
  }

  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return this.request<Payment>(`/payments/${id}`);
  }

  // ==================== DELIVERY ====================

  async trackDelivery(orderId: string): Promise<ApiResponse<Delivery>> {
    return this.request<Delivery>(`/deliveries/${orderId}/track`);
  }
}

export const apiClient = new ApiClient();
