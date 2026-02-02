FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY inventory-service/package*.json ./
RUN npm install
COPY inventory-service/prisma ./prisma
RUN npx prisma generate
COPY inventory-service/ ./
RUN npm run build
EXPOSE 3004
CMD ["npm", "start"]
