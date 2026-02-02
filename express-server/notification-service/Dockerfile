FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY notification-service/package*.json ./
RUN npm install
COPY notification-service/ ./
RUN npm run build
EXPOSE 3009
CMD ["npm", "start"]
