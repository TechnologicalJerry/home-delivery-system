// Redis Geo commands for delivery tracking
import { redisClient } from '@home-delivery/shared';
import { REDIS_KEYS } from '@home-delivery/shared';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('delivery-geo');

export class DeliveryGeo {
  // Store delivery agent location
  async setAgentLocation(agentId: string, lat: number, lng: number): Promise<void> {
    try {
      const client = redisClient.getClient();
      const key = REDIS_KEYS.DELIVERY_AGENT(agentId);
      
      await client.geoAdd('delivery:agents', {
        longitude: lng,
        latitude: lat,
        member: agentId,
      });

      logger.debug('Agent location updated', { agentId, lat, lng });
    } catch (error) {
      logger.error('Error setting agent location', error, { agentId });
      throw error;
    }
  }

  // Get nearby delivery agents
  async getNearbyAgents(lat: number, lng: number, radiusKm: number = 5): Promise<string[]> {
    try {
      const client = redisClient.getClient();
      const results = await client.geoSearch(
        'delivery:agents',
        {
          longitude: lng,
          latitude: lat,
        },
        {
          radius: radiusKm,
          unit: 'km',
        }
      );

      return results.map((r: any) => r.member);
    } catch (error) {
      logger.error('Error getting nearby agents', error);
      return [];
    }
  }

  // Store delivery current location
  async updateDeliveryLocation(deliveryId: string, lat: number, lng: number): Promise<void> {
    try {
      const client = redisClient.getClient();
      const key = REDIS_KEYS.DELIVERY_LOCATION(deliveryId);
      
      await client.setEx(
        key,
        3600, // 1 hour TTL
        JSON.stringify({ lat, lng, timestamp: new Date().toISOString() })
      );

      logger.debug('Delivery location updated', { deliveryId, lat, lng });
    } catch (error) {
      logger.error('Error updating delivery location', error, { deliveryId });
    }
  }

  // Get delivery location
  async getDeliveryLocation(deliveryId: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const client = redisClient.getClient();
      const key = REDIS_KEYS.DELIVERY_LOCATION(deliveryId);
      const data = await client.get(key);

      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);
      return { lat: parsed.lat, lng: parsed.lng };
    } catch (error) {
      logger.error('Error getting delivery location', error, { deliveryId });
      return null;
    }
  }
}
