# 📮 Postman Collections Guide

This document explains how to use the Postman collections for each microservice in the Home Delivery System.

## 📁 Collections Overview

Each microservice has its own Postman collection file located in the service directory:

- `api-gateway/postman-collection.json` - Main API Gateway collection (recommended for testing)
- `auth-service/postman-collection.json` - Authentication endpoints
- `user-service/postman-collection.json` - User profile management
- `product-service/postman-collection.json` - Product catalog
- `inventory-service/postman-collection.json` - Inventory management
- `cart-service/postman-collection.json` - Shopping cart operations
- `order-service/postman-collection.json` - Order processing
- `payment-service/postman-collection.json` - Payment processing
- `delivery-service/postman-collection.json` - Delivery tracking
- `notification-service/postman-collection.json` - Info only (event-driven)
- `analytics-service/postman-collection.json` - Info only (event-driven)

## 🚀 Quick Start

### 1. Import Collections into Postman

1. Open Postman
2. Click **Import** button
3. Select the collection file(s) you want to import
4. Collections will appear in your Postman workspace

### 2. Set Up Environment Variables

Create a Postman Environment with these variables:

```json
{
  "baseUrl": "http://localhost:3000",
  "token": ""
}
```

Or use collection-level variables (already included in each collection).

### 3. Using the Collections

#### Recommended: Start with API Gateway Collection

The **API Gateway collection** is the most comprehensive and includes all routes through the gateway:

1. Import `api-gateway/postman-collection.json`
2. Start with **Auth > Login** to get a token
3. The token will be automatically saved to the `token` variable
4. Use other endpoints with authentication

#### Individual Service Collections

For direct service testing (bypassing API Gateway):

1. Import individual service collections
2. Update `baseUrl` to match service port:
   - Auth Service: `http://localhost:3001`
   - User Service: `http://localhost:3002`
   - Product Service: `http://localhost:3003`
   - etc.

## 📋 Collection Details

### API Gateway Collection

**Base URL:** `http://localhost:3000`

**Endpoints:**
- ✅ Auth (Register, Login, Refresh Token)
- ✅ User Profile (Get, Update)
- ✅ Products (List, Get by ID)
- ✅ Inventory (Get)
- ✅ Cart (Get, Add Item, Update, Remove, Clear)
- ✅ Orders (Create, List, Get, Cancel)
- ✅ Payments (Create, Get)
- ✅ Delivery (Track)
- ✅ Health Check

**Features:**
- Auto-saves token after login
- All routes prefixed with `/api`
- Includes authentication headers

### Auth Service Collection

**Base URL:** `http://localhost:3001`

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `GET /health` - Health check

### User Service Collection

**Base URL:** `http://localhost:3002`

**Endpoints:**
- `GET /users/profile` - Get user profile (requires `x-user-id` header)
- `PUT /users/profile` - Update user profile (requires `x-user-id` header)
- `GET /health` - Health check

**Note:** Requires `x-user-id` header when calling directly (API Gateway sets this automatically).

### Product Service Collection

**Base URL:** `http://localhost:3003`

**Endpoints:**
- `GET /products` - Get all products (optional `?category=electronics`)
- `GET /products/:id` - Get product by ID
- `GET /health` - Health check

### Inventory Service Collection

**Base URL:** `http://localhost:3004`

**Endpoints:**
- `GET /inventory/:productId` - Get inventory for product
- `POST /inventory/:productId/reserve` - Reserve inventory
- `POST /inventory/:productId/release` - Release reserved inventory
- `GET /health` - Health check

### Cart Service Collection

**Base URL:** `http://localhost:3005`

**Endpoints:**
- `GET /cart` - Get user's cart (requires `x-user-id` header)
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update cart item quantity
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear entire cart
- `GET /health` - Health check

### Order Service Collection

**Base URL:** `http://localhost:3006`

**Endpoints:**
- `POST /orders` - Create new order (requires cart with items)
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order by ID
- `POST /orders/:id/cancel` - Cancel order
- `GET /health` - Health check

### Payment Service Collection

**Base URL:** `http://localhost:3007`

**Endpoints:**
- `POST /payments` - Create payment for order
- `GET /payments/:id` - Get payment details
- `POST /payments/webhooks/stripe` - Stripe webhook endpoint
- `GET /health` - Health check

### Delivery Service Collection

**Base URL:** `http://localhost:3008`

**Endpoints:**
- `GET /deliveries/:orderId/track` - Track delivery status
- `PUT /deliveries/:deliveryId/location` - Update delivery location (for agents)
- `GET /health` - Health check

### Notification Service

**Note:** This service is event-driven and doesn't expose HTTP endpoints. It automatically processes events from Redis Streams and sends notifications.

### Analytics Service

**Note:** This service is event-driven and doesn't expose HTTP endpoints. It automatically processes events from Redis Streams and stores analytics data in MongoDB.

## 🔐 Authentication Flow

1. **Register a new user:**
   ```
   POST /api/auth/register
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Login to get token:**
   ```
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
   The token is automatically saved to the `token` variable.

3. **Use token in subsequent requests:**
   All authenticated endpoints automatically include:
   ```
   Authorization: Bearer {{token}}
   ```

## 📝 Example Workflow

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **Import API Gateway collection**

3. **Register user:**
   - Run `Auth > Register`

4. **Login:**
   - Run `Auth > Login` (token saved automatically)

5. **Browse products:**
   - Run `Products > Get Products`

6. **Add to cart:**
   - Run `Cart > Add Item to Cart` (use product ID from step 5)

7. **Create order:**
   - Run `Orders > Create Order` (with delivery address)

8. **Process payment:**
   - Run `Payments > Create Payment` (use order ID from step 7)

9. **Track delivery:**
   - Run `Delivery > Track Delivery` (use order ID)

## 🔧 Customization

### Update Base URLs

Each collection has a `baseUrl` variable. Update it to:
- Test against different environments (dev, staging, prod)
- Test services directly (bypass API Gateway)
- Use different ports

### Add Pre-request Scripts

You can add pre-request scripts to:
- Auto-generate test data
- Set dynamic headers
- Perform setup operations

### Add Tests

Add test scripts to:
- Validate response status codes
- Check response structure
- Save response data to variables

## 📚 Tips

1. **Use Environment Variables:** Create separate environments for dev/staging/prod
2. **Organize with Folders:** Collections are already organized by feature
3. **Use Collection Runner:** Run multiple requests in sequence
4. **Save Examples:** Save example responses for documentation
5. **Share Collections:** Export and share with your team

## 🐛 Troubleshooting

### Token Not Saving
- Check that the Login request has a test script that saves the token
- Verify the response structure matches the test script

### 401 Unauthorized
- Ensure token is set in collection/environment variables
- Check token hasn't expired (default: 24 hours)
- Use Refresh Token endpoint to get a new token

### Connection Refused
- Verify services are running: `docker-compose ps`
- Check service ports match collection base URLs
- Ensure services are accessible (not blocked by firewall)

### 404 Not Found
- Verify endpoint paths match service routes
- Check if service is running and healthy
- Use Health Check endpoints to verify service status

## 📖 Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/)
- [API Gateway README](../README.md)
- Service-specific documentation in each service directory
