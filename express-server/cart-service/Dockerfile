FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY cart-service/package*.json ./
RUN npm install
COPY cart-service/ ./
RUN npm run build
EXPOSE 3005
CMD ["npm", "start"]
