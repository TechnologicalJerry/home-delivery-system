FROM node:20-alpine

WORKDIR /app

# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared

# Copy service package files
COPY user-service/package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY user-service/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy service source code
COPY user-service/ ./

# Build
RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
