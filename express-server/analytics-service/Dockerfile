FROM node:20-alpine
WORKDIR /app
# Copy shared package first
COPY shared/package*.json ./shared/
COPY shared ./shared
# Copy service package files
COPY analytics-service/package*.json ./
RUN npm install
COPY analytics-service/ ./
RUN npm run build
EXPOSE 3010
CMD ["npm", "start"]
