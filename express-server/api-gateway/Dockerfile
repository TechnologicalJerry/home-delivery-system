FROM node:20-alpine

WORKDIR /app

# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared

# Copy service package files
COPY api-gateway/package*.json ./

# Install dependencies
RUN npm install

# Copy service source code
COPY api-gateway/ ./

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
