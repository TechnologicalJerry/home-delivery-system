# 🎨 Frontend Integration Guide for Next.js

Complete guide to integrate the Home Delivery System APIs with your Next.js frontend.

## 📦 Quick Setup

### 1. Copy Files to Your Next.js Project

Copy these files to your Next.js project:

```
your-nextjs-project/
├── types/
│   └── api.ts          (from frontend-types.ts)
├── lib/
│   └── api-client.ts   (from frontend-api-client.ts)
└── .env.local
```

### 2. Environment Variables

Create `.env.local` in your Next.js project:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Install Dependencies (if needed)

```bash
npm install socket.io-client  # For real-time delivery tracking
```

---

## 🚀 Usage Examples

### Authentication Flow

```typescript
// pages/login.tsx or app/login/page.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.login(email, password);
      if (response.success) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Products Page

```typescript
// app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await apiClient.getProducts();
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      <div className="grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Cart Management

```typescript
// hooks/useCart.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Cart } from '@/types/api';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await apiClient.getCart();
      if (response.success) {
        setCart(response.data || null);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number, price: number, name?: string) => {
    try {
      const response = await apiClient.addToCart({ productId, quantity, price, name });
      if (response.success) {
        setCart(response.data || null);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      const response = await apiClient.updateCartItem(itemId, quantity);
      if (response.success) {
        setCart(response.data || null);
      }
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await apiClient.removeCartItem(itemId);
      if (response.success) {
        setCart(response.data || null);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  const clear = async () => {
    try {
      await apiClient.clearCart();
      setCart(null);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  return {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    clear,
    refetch: loadCart,
  };
}
```

### Order Creation

```typescript
// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.createOrder({
        ...address,
        coordinates: {
          lat: 40.7128, // Get from geocoding service
          lng: -74.0060,
        },
      });

      if (response.success && response.data) {
        // Redirect to payment page
        router.push(`/payment?orderId=${response.data.id}`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <input
        placeholder="Street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <input
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      />
      <input
        placeholder="Zip Code"
        value={address.zipCode}
        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

### Real-time Delivery Tracking

```typescript
// hooks/useDeliveryTracking.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Delivery } from '@/types/api';

export function useDeliveryTracking(orderId: string) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to delivery service WebSocket
    const newSocket = io('http://localhost:3008');
    setSocket(newSocket);

    // Join delivery room
    newSocket.emit('join-delivery', orderId);

    // Listen for location updates
    newSocket.on('location-update', (data: { deliveryId: string; location: { lat: number; lng: number } }) => {
      setDelivery((prev) => prev ? { ...prev, currentLocation: data.location } : null);
    });

    // Listen for status updates
    newSocket.on('status-update', (data: { deliveryId: string; status: string }) => {
      setDelivery((prev) => prev ? { ...prev, status: data.status as any } : null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [orderId]);

  return { delivery, socket };
}
```

---

## 🔒 Authentication Middleware

### Next.js Middleware for Protected Routes

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // Protected routes
  const protectedPaths = ['/dashboard', '/cart', '/orders', '/profile'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/cart/:path*', '/orders/:path*', '/profile/:path*'],
};
```

---

## 📱 Complete API Routes Summary

### Base URL
```
http://localhost:3000/api
```

### All Available Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Register user |
| `/auth/login` | POST | ❌ | Login |
| `/auth/refresh` | POST | ❌ | Refresh token |
| `/users/profile` | GET | ✅ | Get profile |
| `/users/profile` | PUT | ✅ | Update profile |
| `/products` | GET | ❌ | List products |
| `/products/:id` | GET | ❌ | Get product |
| `/inventory/:productId` | GET | ❌ | Get inventory |
| `/cart` | GET | ✅ | Get cart |
| `/cart/items` | POST | ✅ | Add to cart |
| `/cart/items/:itemId` | PUT | ✅ | Update item |
| `/cart/items/:itemId` | DELETE | ✅ | Remove item |
| `/cart` | DELETE | ✅ | Clear cart |
| `/orders` | POST | ✅ | Create order |
| `/orders` | GET | ✅ | List orders |
| `/orders/:id` | GET | ✅ | Get order |
| `/orders/:id/cancel` | POST | ✅ | Cancel order |
| `/payments` | POST | ✅ | Create payment |
| `/payments/:id` | GET | ✅ | Get payment |
| `/deliveries/:orderId/track` | GET | ✅ | Track delivery |

---

## 🎯 Best Practices

1. **Error Handling**: Always wrap API calls in try-catch
2. **Loading States**: Show loading indicators during API calls
3. **Token Management**: Store tokens securely (consider httpOnly cookies for production)
4. **Type Safety**: Use TypeScript types from `types/api.ts`
5. **Caching**: Consider using React Query or SWR for data fetching
6. **Real-time**: Use Socket.io for delivery tracking updates

---

## 🔧 Advanced: React Query Integration

```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// hooks/useProductsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProductsQuery(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => apiClient.getProducts(category),
    select: (response) => response.data || [],
  });
}
```

---

## 📞 Support

For API issues or questions, refer to:
- `API_DOCUMENTATION.md` - Complete API reference
- `POSTMAN_COLLECTIONS.md` - Postman collection guide
- `PORTS_AND_DATABASES.md` - Server and database info
