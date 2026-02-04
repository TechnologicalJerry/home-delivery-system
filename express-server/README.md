# 🏠 Home Delivery System

A production-ready microservices-based home delivery system (Blinkit/Instamart-like) built with Node.js, TypeScript, and modern cloud-native patterns.

## 🏗️ Architecture

This system implements a **microservices architecture** with:

- **API Gateway** - Single entry point with authentication and rate limiting
- **Auth Service** - JWT-based authentication and authorization
- **User Service** - User profile management with Redis cache-aside pattern
- **Product Service** - Product catalog with Redis caching
- **Inventory Service** - Inventory management with Redis transactions
- **Cart Service** - Shopping cart stored entirely in Redis
- **Order Service** - Order processing with event-driven architecture
- **Payment Service** - Payment processing with webhook support
- **Delivery Service** - Real-time delivery tracking with Socket.io
- **Notification Service** - Event-driven notifications (Email/SMS)
- **Analytics Service** - Event processing and analytics (MongoDB)

## 🚀 Features

- ✅ **Microservices Architecture** - Database per service pattern
- ✅ **Redis Caching** - Cache-aside, write-through, and Redis-based storage
- ✅ **Event-Driven** - Redis Streams for asynchronous communication
- ✅ **Real-time Tracking** - Socket.io for delivery updates
- ✅ **Clean Architecture** - Controllers, Services, Repositories pattern
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Input Validation** - Zod schema validation
- ✅ **Production Ready** - Error handling, logging, health checks

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- npm 9+

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd home-delivery-system
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration (API keys, database passwords, etc.)

### 3. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- All PostgreSQL databases (one per service)
- MongoDB (for analytics)
- Redis (for caching and streams)
- Kafka & Zookeeper (for event streaming)
- All microservices

### 4. Run Database Migrations

For each service with Prisma:

```bash
# Auth Service
cd auth-service
npx prisma migrate dev
cd ..

# User Service
cd user-service
npx prisma migrate dev
cd ..

# Product Service
cd product-service
npx prisma migrate dev
cd ..

# Inventory Service
cd inventory-service
npx prisma migrate dev
cd ..

# Order Service
cd order-service
npx prisma migrate dev
cd ..

# Payment Service
cd payment-service
npx prisma migrate dev
cd ..

# Delivery Service
cd delivery-service
npx prisma migrate dev
cd ..
```

### 5. Verify Services

Check service health:

```bash
# API Gateway
curl http://localhost:3000/health

# Individual services
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # User
curl http://localhost:3003/health  # Product
# ... etc
```

## 📚 API Documentation

### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### Products

**Get Products**
```http
GET /api/products
```

**Get Product by ID**
```http
GET /api/products/:id
```

### Cart

**Get Cart** (requires auth)
```http
GET /api/cart
Authorization: Bearer <token>
```

**Add Item to Cart**
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2,
  "price": 29.99,
  "name": "Product Name"
}
```

### Orders

**Create Order** (requires auth)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
}
```

**Get Orders**
```http
GET /api/orders
Authorization: Bearer <token>
```

**Track Delivery**
```http
GET /api/deliveries/:orderId/track
Authorization: Bearer <token>
```

## 🔧 Development

### Local Development (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start infrastructure services (PostgreSQL, Redis, Kafka):
```bash
docker-compose up -d postgres-auth postgres-user postgres-product postgres-inventory postgres-order postgres-payment postgres-delivery mongodb-analytics redis zookeeper kafka
```

3. Run services individually:
```bash
# Terminal 1 - API Gateway
cd api-gateway && npm run dev

# Terminal 2 - Auth Service
cd auth-service && npm run dev

# Terminal 3 - User Service
cd user-service && npm run dev

# ... etc for each service
```

### Building Services

```bash
# Build all services
npm run build

# Build specific service
cd <service-name>
npm run build
```

## 🏛️ Architecture Patterns

### Caching Strategies

1. **Cache-Aside (User Service)**
   - Check cache first
   - On miss, fetch from DB and populate cache
   - On update, invalidate cache

2. **Write-Through (Product Service)**
   - Write to both cache and DB simultaneously
   - Ensures consistency

3. **Redis Storage (Cart Service)**
   - Cart stored entirely in Redis
   - Fast read/write operations

4. **Redis Transactions (Inventory Service)**
   - Atomic operations using MULTI/EXEC
   - Prevents race conditions

### Event-Driven Communication

- **Redis Streams** - Used for event publishing/consuming
- **Event Types**:
  - `order.created`, `order.confirmed`, `order.cancelled`
  - `payment.initiated`, `payment.success`, `payment.failed`
  - `delivery.assigned`, `delivery.in_transit`, `delivery.completed`
  - `inventory.updated`, `inventory.low_stock`

### Database Per Service

Each service has its own database:
- **Auth Service** → PostgreSQL (auth_db)
- **User Service** → PostgreSQL (user_db)
- **Product Service** → PostgreSQL (product_db)
- **Inventory Service** → PostgreSQL (inventory_db)
- **Order Service** → PostgreSQL (order_db)
- **Payment Service** → PostgreSQL (payment_db)
- **Delivery Service** → PostgreSQL (delivery_db)
- **Analytics Service** → MongoDB (analytics)

## 📊 Service Ports

| Service | Port |
|---------|------|
| API Gateway | 3000 |
| Auth Service | 3001 |
| User Service | 3002 |
| Product Service | 3003 |
| Inventory Service | 3004 |
| Cart Service | 3005 |
| Order Service | 3006 |
| Payment Service | 3007 |
| Delivery Service | 3008 |
| Notification Service | 3009 |
| Analytics Service | 3010 |

## 🧪 Testing

```bash
# Run tests for a specific service
cd <service-name>
npm test
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `JWT_SECRET` - Secret for JWT token signing
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `KAFKA_BROKERS` - Kafka broker addresses
- Database URLs for each service

## 🚢 Deployment

### Production Considerations

1. **Secrets Management** - Use environment variables or secret management service
2. **Database Backups** - Set up automated backups for all databases
3. **Monitoring** - Add APM tools (e.g., Datadog, New Relic)
4. **Logging** - Centralized logging (e.g., ELK stack)
5. **Scaling** - Use Kubernetes or Docker Swarm for orchestration
6. **Load Balancing** - Add load balancer in front of API Gateway
7. **SSL/TLS** - Enable HTTPS for all services

## 📖 Project Structure

```
home-delivery-system/
├── api-gateway/          # API Gateway service
├── auth-service/         # Authentication service
├── user-service/         # User management service
├── product-service/      # Product catalog service
├── inventory-service/    # Inventory management service
├── cart-service/         # Shopping cart service
├── order-service/        # Order processing service
├── payment-service/      # Payment processing service
├── delivery-service/     # Delivery tracking service
├── notification-service/ # Notification service
├── analytics-service/    # Analytics service
├── shared/              # Shared utilities and types
├── docker-compose.yml    # Docker Compose configuration
└── .env.example          # Environment variables template
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

See LICENSE file for details.

## 🙏 Acknowledgments

Built following microservices best practices and clean architecture principles.
