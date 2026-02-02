import { PrismaClient, DeliveryStatus } from '@prisma/client';
import { DeliveryGeo } from '../redis/delivery.geo';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('delivery-service');
const prisma = new PrismaClient();
const deliveryGeo = new DeliveryGeo();

export interface CreateDeliveryInput {
  orderId: string;
  pickupLocation: { lat: number; lng: number };
  deliveryLocation: { lat: number; lng: number };
}

export class DeliveryService {
  async createDelivery(input: CreateDeliveryInput): Promise<any> {
    // Find nearby agent
    const nearbyAgents = await deliveryGeo.getNearbyAgents(
      input.pickupLocation.lat,
      input.pickupLocation.lng,
      5
    );

    const delivery = await prisma.delivery.create({
      data: {
        orderId: input.orderId,
        status: DeliveryStatus.PENDING,
        pickupLocation: input.pickupLocation,
        deliveryLocation: input.deliveryLocation,
        deliveryAgentId: nearbyAgents[0] || null,
      },
    });

    if (delivery.deliveryAgentId) {
      await prisma.delivery.update({
        where: { id: delivery.id },
        data: { status: DeliveryStatus.ASSIGNED },
      });
    }

    logger.info('Delivery created', { deliveryId: delivery.id, orderId: input.orderId });

    return delivery;
  }

  async updateLocation(deliveryId: string, lat: number, lng: number): Promise<void> {
    await deliveryGeo.updateDeliveryLocation(deliveryId, lat, lng);
    
    await prisma.delivery.update({
      where: { id: deliveryId },
      data: { currentLocation: { lat, lng } },
    });
  }

  async getDelivery(orderId: string): Promise<any> {
    const delivery = await prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    return delivery;
  }

  async updateStatus(deliveryId: string, status: DeliveryStatus): Promise<any> {
    return await prisma.delivery.update({
      where: { id: deliveryId },
      data: { status },
    });
  }
}
