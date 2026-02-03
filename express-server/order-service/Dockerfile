FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY order-service/package*.json ./
RUN npm install
COPY order-service/prisma ./prisma
RUN npx prisma generate
COPY order-service/ ./
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
