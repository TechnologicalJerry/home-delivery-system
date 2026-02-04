FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY product-service/package*.json ./
RUN npm install
COPY product-service/prisma ./prisma
RUN npx prisma generate
COPY product-service/ ./
RUN npm run build
EXPOSE 3003
CMD ["npm", "start"]
