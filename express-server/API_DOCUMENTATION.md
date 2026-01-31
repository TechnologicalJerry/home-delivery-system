# 📚 API Documentation for Next.js Frontend

Complete API reference for the Home Delivery System microservices.

## 🔗 Base Configuration

**API Gateway Base URL:**
```
http://localhost:3000/api
```

**Environment Variables (for Next.js):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 📋 Response Format

All API responses follow this structure:

### Success Response
```typescript
{
  success: true,
  data: any,
  timestamp: string
}
```

### Error Response
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  },
  timestamp: string
}
```

---

## 🔐 Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

**Request:**
```typescript
{
  email: string;      // Valid email format
  password: string;   // Minimum 8 characters
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    userId: string;
    email: string;
  },
  timestamp: string
}
```

**Example:**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const data = await response.json();
```

---

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    accessToken: string;    // JWT token (expires in 24h)
    refreshToken: string;   // Refresh token (expires in 7d)
    expiresIn: number;      // Seconds until expiration
  },
  timestamp: string
}
```

**Example:**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const data = await response.json();

// Store tokens
if (data.success) {
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
}
```

---

### Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:** Same as Login response

---

## 👤 User Profile

### Get User Profile

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    preferences?: {
      notifications?: boolean;
      language?: string;
      [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
  },
  timestamp: string
}
```

**Example:**
```typescript
const token = localStorage.getItem('accessToken');
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

### Update User Profile

**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```typescript
{
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  preferences?: {
    notifications?: boolean;
    language?: string;
    [key: string]: any;
  };
}
```

**Response:** Same as Get User Profile

---

## 🛍️ Products

### Get All Products

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `category` (optional): Filter by category (e.g., `?category=electronics`)

**Response:**
```typescript
{
  success: true,
  data: Array<{
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>,
  timestamp: string
}
```

**Example:**
```typescript
// Get all products
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
const data = await response.json();

// Get products by category
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products?category=electronics`
);
const data = await response.json();
```

---

### Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  },
  timestamp: string
}
```

---

## 📦 Inventory

### Get Inventory

**Endpoint:** `GET /api/inventory/:productId`

**Response:**
```typescript
{
  success: true,
  data: {
    quantity: number;
    available: number;
  },
  timestamp: string
}
```

**Example:**
```typescript
const productId = 'product-uuid';
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/inventory/${productId}`
);
const data = await response.json();
```

---

## 🛒 Cart

### Get Cart

**Endpoint:** `GET /api/cart`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```typescript
{
  success: true,
  data: {
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      name?: string;
    }>;
    total: number;
    updatedAt: string;
  },
  timestamp: string
}
```

---

### Add Item to Cart

**Endpoint:** `POST /api/cart/items`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```typescript
{
  productId: string;
  quantity: number;    // Must be positive
  price: number;       // Must be positive
  name?: string;
}
```

**Response:** Same as Get Cart

**Example:**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: 'product-uuid',
    quantity: 2,
    price: 29.99,
    name: 'Product Name'
  })
});
const data = await response.json();
```

---

### Update Cart Item

**Endpoint:** `PUT /api/cart/items/:itemId`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```typescript
{
  quantity: number;  // Must be positive (0 removes item)
}
```

**Response:** Same as Get Cart

---

### Remove Item from Cart

**Endpoint:** `DELETE /api/cart/items/:itemId`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** Same as Get Cart

---

### Clear Cart

**Endpoint:** `DELETE /api/cart`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```typescript
{
  success: true,
  message: 'Cart cleared',
  timestamp: string
}
```

---

## 📋 Orders

### Create Order

**Endpoint:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```typescript
{
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
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
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
    paymentId?: string;
    deliveryId?: string;
    createdAt: string;
    updatedAt: string;
  },
  timestamp: string
}
```

**Example:**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    deliveryAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    }
  })
});
const data = await response.json();
```

---

### Get Orders

**Endpoint:** `GET /api/orders`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```typescript
{
  success: true,
  data: Array<Order>,  // Array of order objects (same structure as Create Order response)
  timestamp: string
}
```

---

### Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```typescript
{
  success: true,
  data: Order,  // Order object
  timestamp: string
}
```

---

### Cancel Order

**Endpoint:** `POST /api/orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```typescript
{
  reason?: string;  // Optional cancellation reason
}
```

**Response:**
```typescript
{
  success: true,
  data: Order,  // Updated order object
  timestamp: string
}
```

---

## 💳 Payments

### Create Payment

**Endpoint:** `POST /api/payments`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**
```typescript
{
  orderId: string;
  amount: number;
  paymentMethod: string;  // e.g., 'credit_card', 'debit_card', 'upi'
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;  // Default: 'USD'
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
    paymentMethod: string;
    transactionId?: string;
    refundId?: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
  },
  timestamp: string
}
```

---

### Get Payment

**Endpoint:** `GET /api/payments/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** Same as Create Payment response

---

## 🚚 Delivery

### Track Delivery

**Endpoint:** `GET /api/deliveries/:orderId/track`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    orderId: string;
    deliveryAgentId?: string;
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
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
    estimatedTime?: number;  // minutes
    actualTime?: number;      // minutes
    createdAt: string;
    updatedAt: string;
  },
  timestamp: string
}
```

---

## 🔧 Next.js API Client Example

### Create API Client Utility

Create `lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Get token from localStorage or cookies
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
  ): Promise<T> {
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
      throw new ApiError(data.error?.message || 'Request failed', data.error?.code, response.status);
    }

    return data;
  }

  // Auth
  async register(email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    const data = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.success && data.data.accessToken) {
      this.setToken(data.data.accessToken);
    }
    return data;
  }

  async refreshToken(refreshToken: string) {
    const data = await this.request<any>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    if (data.success && data.data.accessToken) {
      this.setToken(data.data.accessToken);
    }
    return data;
  }

  // User
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profile: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Products
  async getProducts(category?: string) {
    const url = category ? `/products?category=${category}` : '/products';
    return this.request(url);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  // Inventory
  async getInventory(productId: string) {
    return this.request(`/inventory/${productId}`);
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(item: { productId: string; quantity: number; price: number; name?: string }) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: string) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(deliveryAddress: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ deliveryAddress }),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id: string, reason?: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Payments
  async createPayment(orderId: string, amount: number, paymentMethod: string) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, paymentMethod }),
    });
  }

  async getPayment(id: string) {
    return this.request(`/payments/${id}`);
  }

  // Delivery
  async trackDelivery(orderId: string) {
    return this.request(`/deliveries/${orderId}/track`);
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();
export { ApiError };
```

---

## 📝 TypeScript Types

Create `types/api.ts`:

```typescript
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
```

---

## 🎯 Usage Examples

### React Hook Example

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiClient.setToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    if (response.success) {
      await loadUser();
    }
    return response;
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  return { user, loading, login, logout, loadUser };
}
```

### React Hook for Products

```typescript
// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types/api';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts(category);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: loadProducts };
}
```

---

## ⚠️ Error Handling

### Common Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Missing or invalid token
- `TOKEN_EXPIRED` - Token has expired
- `NOT_FOUND` - Resource not found
- `SERVICE_ERROR` - Internal service error
- `RATE_LIMIT_EXCEEDED` - Too many requests

### Error Handling Example

```typescript
try {
  const response = await apiClient.getCart();
  if (response.success) {
    // Handle success
  }
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
      case 'TOKEN_EXPIRED':
        // Redirect to login
        router.push('/login');
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Show rate limit message
        toast.error('Too many requests. Please try again later.');
        break;
      default:
        toast.error(error.message);
    }
  }
}
```

---

## 🔄 Real-time Updates (Socket.io)

For delivery tracking, connect to the delivery service WebSocket:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3008');

// Join delivery room
socket.emit('join-delivery', orderId);

// Listen for location updates
socket.on('location-update', (data) => {
  console.log('Delivery location:', data);
});

// Listen for status updates
socket.on('status-update', (data) => {
  console.log('Delivery status:', data);
});
```

---

## 📊 Complete API Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login and get tokens |
| `/api/auth/refresh` | POST | ❌ | Refresh access token |
| `/api/users/profile` | GET | ✅ | Get user profile |
| `/api/users/profile` | PUT | ✅ | Update user profile |
| `/api/products` | GET | ❌ | Get all products |
| `/api/products/:id` | GET | ❌ | Get product by ID |
| `/api/inventory/:productId` | GET | ❌ | Get inventory |
| `/api/cart` | GET | ✅ | Get cart |
| `/api/cart/items` | POST | ✅ | Add item to cart |
| `/api/cart/items/:itemId` | PUT | ✅ | Update cart item |
| `/api/cart/items/:itemId` | DELETE | ✅ | Remove cart item |
| `/api/cart` | DELETE | ✅ | Clear cart |
| `/api/orders` | POST | ✅ | Create order |
| `/api/orders` | GET | ✅ | Get user orders |
| `/api/orders/:id` | GET | ✅ | Get order by ID |
| `/api/orders/:id/cancel` | POST | ✅ | Cancel order |
| `/api/payments` | POST | ✅ | Create payment |
| `/api/payments/:id` | GET | ✅ | Get payment |
| `/api/deliveries/:orderId/track` | GET | ✅ | Track delivery |

---

## 🚀 Quick Start for Next.js

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Use the API client:**
```typescript
import { apiClient } from '@/lib/api-client';

// In your component or API route
const products = await apiClient.getProducts();
const cart = await apiClient.getCart();
```

This documentation provides everything you need to integrate the backend APIs with your Next.js frontend!
