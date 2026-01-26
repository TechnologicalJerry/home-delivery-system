FROM node:20-alpine

WORKDIR /app

# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared

# Copy service package files
COPY auth-service/package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY auth-service/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy service source code
COPY auth-service/ ./

# Build
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
