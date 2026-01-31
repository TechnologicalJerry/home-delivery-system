FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY delivery-service/package*.json ./
RUN npm install
COPY delivery-service/prisma ./prisma
RUN npx prisma generate
COPY delivery-service/ ./
RUN npm run build
EXPOSE 3008
CMD ["npm", "start"]
