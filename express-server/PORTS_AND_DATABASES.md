# 🚀 Server Ports & Database Names Reference

Complete reference for all microservices ports and database configurations.

## 📊 Microservices Ports

| Service | Port | Container Name | URL |
|---------|------|----------------|-----|
| **API Gateway** | `3000` | `api-gateway` | `http://localhost:3000` |
| **Auth Service** | `3001` | `auth-service` | `http://localhost:3001` |
| **User Service** | `3002` | `user-service` | `http://localhost:3002` |
| **Product Service** | `3003` | `product-service` | `http://localhost:3003` |
| **Inventory Service** | `3004` | `inventory-service` | `http://localhost:3004` |
| **Cart Service** | `3005` | `cart-service` | `http://localhost:3005` |
| **Order Service** | `3006` | `order-service` | `http://localhost:3006` |
| **Payment Service** | `3007` | `payment-service` | `http://localhost:3007` |
| **Delivery Service** | `3008` | `delivery-service` | `http://localhost:3008` |
| **Notification Service** | `3009` | `notification-service` | `http://localhost:3009` |
| **Analytics Service** | `3010` | `analytics-service` | `http://localhost:3010` |

## 🗄️ Database Configuration

### PostgreSQL Databases (Database Per Service)

| Service | Database Name | Container Name | Host (Docker) | Port (Host) | Port (Container) | Username | Password |
|---------|--------------|----------------|---------------|-------------|------------------|----------|----------|
| **Auth Service** | `auth_db` | `postgres-auth` | `postgres-auth` | `5432` | `5432` | `postgres` | `postgres` |
| **User Service** | `user_db` | `postgres-user` | `postgres-user` | `5433` | `5432` | `postgres` | `postgres` |
| **Product Service** | `product_db` | `postgres-product` | `postgres-product` | `5434` | `5432` | `postgres` | `postgres` |
| **Inventory Service** | `inventory_db` | `postgres-inventory` | `postgres-inventory` | `5435` | `5432` | `postgres` | `postgres` |
| **Order Service** | `order_db` | `postgres-order` | `postgres-order` | `5436` | `5432` | `postgres` | `postgres` |
| **Payment Service** | `payment_db` | `postgres-payment` | `postgres-payment` | `5437` | `5432` | `postgres` | `postgres` |
| **Delivery Service** | `delivery_db` | `postgres-delivery` | `postgres-delivery` | `5438` | `5432` | `postgres` | `postgres` |

### MongoDB Database

| Service | Database Name | Container Name | Host (Docker) | Port | Username | Password |
|---------|--------------|----------------|---------------|------|----------|----------|
| **Analytics Service** | `analytics` | `mongodb-analytics` | `mongodb-analytics` | `27017` | `admin` | `admin` |

**MongoDB Connection String:**
```
mongodb://admin:admin@mongodb-analytics:27017/analytics?authSource=admin
```

### Redis (Cache & Streams)

| Service | Container Name | Host (Docker) | Port | Database | Password |
|---------|----------------|---------------|------|----------|----------|
| **Redis** | `redis` | `redis` | `6379` | `0` | (none) |

**Redis Connection:**
- Host: `redis` (Docker) / `localhost` (Local)
- Port: `6379`
- Database: `0`

### Kafka (Event Streaming)

| Service | Container Name | Host (Docker) | Port | Notes |
|---------|----------------|---------------|------|-------|
| **Zookeeper** | `zookeeper` | `zookeeper` | `2181` | Internal only |
| **Kafka** | `kafka` | `kafka` | `9092` | `localhost:9092` (external) |

**Kafka Connection:**
- Brokers: `localhost:9092` (external) / `kafka:9092` (Docker network)
- Client ID: `home-delivery-system`
- Group ID: `home-delivery-consumers`

## 🔌 Connection Strings

### PostgreSQL Connection Strings (from Host Machine)

```bash
# Auth Service
postgresql://postgres:postgres@localhost:5432/auth_db

# User Service
postgresql://postgres:postgres@localhost:5433/user_db

# Product Service
postgresql://postgres:postgres@localhost:5434/product_db

# Inventory Service
postgresql://postgres:postgres@localhost:5435/inventory_db

# Order Service
postgresql://postgres:postgres@localhost:5436/order_db

# Payment Service
postgresql://postgres:postgres@localhost:5437/payment_db

# Delivery Service
postgresql://postgres:postgres@localhost:5438/delivery_db
```

### PostgreSQL Connection Strings (from Docker Network)

```bash
# Auth Service
postgresql://postgres:postgres@postgres-auth:5432/auth_db

# User Service
postgresql://postgres:postgres@postgres-user:5432/user_db

# Product Service
postgresql://postgres:postgres@postgres-product:5432/product_db

# Inventory Service
postgresql://postgres:postgres@postgres-inventory:5432/inventory_db

# Order Service
postgresql://postgres:postgres@postgres-order:5432/order_db

# Payment Service
postgresql://postgres:postgres@postgres-payment:5432/payment_db

# Delivery Service
postgresql://postgres:postgres@postgres-delivery:5432/delivery_db
```

## 📝 Quick Reference

### Services Without Databases

- **Cart Service** (Port 3005) - Uses Redis only
- **Notification Service** (Port 3009) - Event-driven, no database
- **Analytics Service** (Port 3010) - Uses MongoDB

### Services Using Multiple Data Stores

- **Inventory Service** - PostgreSQL + Redis (transactions)
- **User Service** - PostgreSQL + Redis (cache)
- **Product Service** - PostgreSQL + Redis (catalog cache)
- **Order Service** - PostgreSQL + Redis (events)
- **Payment Service** - PostgreSQL + Redis (events)
- **Delivery Service** - PostgreSQL + Redis (geo data)

## 🔍 Health Check Endpoints

All services expose a health check endpoint:

```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# User Service
curl http://localhost:3002/health

# Product Service
curl http://localhost:3003/health

# Inventory Service
curl http://localhost:3004/health

# Cart Service
curl http://localhost:3005/health

# Order Service
curl http://localhost:3006/health

# Payment Service
curl http://localhost:3007/health

# Delivery Service
curl http://localhost:3008/health
```

## 🛠️ Database Access Commands

### Connect to PostgreSQL Databases

```bash
# Auth DB
docker exec -it postgres-auth psql -U postgres -d auth_db

# User DB
docker exec -it postgres-user psql -U postgres -d user_db

# Product DB
docker exec -it postgres-product psql -U postgres -d product_db

# Inventory DB
docker exec -it postgres-inventory psql -U postgres -d inventory_db

# Order DB
docker exec -it postgres-order psql -U postgres -d order_db

# Payment DB
docker exec -it postgres-payment psql -U postgres -d payment_db

# Delivery DB
docker exec -it postgres-delivery psql -U postgres -d delivery_db
```

### Connect to MongoDB

```bash
docker exec -it mongodb-analytics mongosh -u admin -p admin --authenticationDatabase admin
```

### Connect to Redis

```bash
docker exec -it redis redis-cli
```

## 📋 Port Summary

### Application Ports (3000-3010)
- `3000` - API Gateway
- `3001` - Auth Service
- `3002` - User Service
- `3003` - Product Service
- `3004` - Inventory Service
- `3005` - Cart Service
- `3006` - Order Service
- `3007` - Payment Service
- `3008` - Delivery Service
- `3009` - Notification Service
- `3010` - Analytics Service

### Database Ports
- `5432` - PostgreSQL (Auth DB)
- `5433` - PostgreSQL (User DB)
- `5434` - PostgreSQL (Product DB)
- `5435` - PostgreSQL (Inventory DB)
- `5436` - PostgreSQL (Order DB)
- `5437` - PostgreSQL (Payment DB)
- `5438` - PostgreSQL (Delivery DB)
- `27017` - MongoDB (Analytics)
- `6379` - Redis

### Infrastructure Ports
- `2181` - Zookeeper (internal)
- `9092` - Kafka

## 🔐 Default Credentials

**PostgreSQL:**
- Username: `postgres`
- Password: `postgres`

**MongoDB:**
- Username: `admin`
- Password: `admin`
- Database: `analytics`
- Auth Source: `admin`

**Redis:**
- Password: (none by default)
- Database: `0`

## ⚠️ Important Notes

1. **Port Conflicts:** If any ports are already in use, update `docker-compose.yml` and `.env` files
2. **Production:** Change all default passwords in production
3. **Network:** Services communicate via Docker network using container names (e.g., `postgres-auth:5432`)
4. **External Access:** Use `localhost` ports for external connections (e.g., from host machine)
5. **Internal Access:** Use container names for inter-service communication (e.g., `postgres-auth:5432`)
