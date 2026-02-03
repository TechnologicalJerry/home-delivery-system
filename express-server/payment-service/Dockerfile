FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY payment-service/package*.json ./
RUN npm install
COPY payment-service/prisma ./prisma
RUN npx prisma generate
COPY payment-service/ ./
RUN npm run build
EXPOSE 3007
CMD ["npm", "start"]
