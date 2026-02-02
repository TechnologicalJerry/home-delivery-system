// Socket.io server for real-time delivery tracking
import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('delivery-socket');

export class TrackingServer {
  private io: SocketServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    this.io.on('connection', (socket) => {
      logger.info('Client connected', { socketId: socket.id });

      // Join delivery room for tracking
      socket.on('join-delivery', (deliveryId: string) => {
        socket.join(`delivery:${deliveryId}`);
        logger.info('Client joined delivery room', { socketId: socket.id, deliveryId });
      });

      // Agent location updates
      socket.on('agent-location', (data: { agentId: string; lat: number; lng: number }) => {
        socket.broadcast.emit('agent-location-update', data);
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected', { socketId: socket.id });
      });
    });
  }

  // Broadcast delivery location update
  broadcastLocationUpdate(deliveryId: string, location: { lat: number; lng: number }) {
    this.io.to(`delivery:${deliveryId}`).emit('location-update', {
      deliveryId,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast delivery status update
  broadcastStatusUpdate(deliveryId: string, status: string) {
    this.io.to(`delivery:${deliveryId}`).emit('status-update', {
      deliveryId,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
