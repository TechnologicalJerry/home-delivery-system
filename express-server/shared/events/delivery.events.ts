// Delivery-related event contracts
export enum DeliveryEventType {
  DELIVERY_ASSIGNED = 'delivery.assigned',
  DELIVERY_STARTED = 'delivery.started',
  DELIVERY_IN_TRANSIT = 'delivery.in_transit',
  DELIVERY_COMPLETED = 'delivery.completed',
  DELIVERY_FAILED = 'delivery.failed',
}

export interface DeliveryAssignedEvent {
  deliveryId: string;
  orderId: string;
  deliveryAgentId: string;
  assignedAt: string;
}

export interface DeliveryStartedEvent {
  deliveryId: string;
  orderId: string;
  startedAt: string;
  pickupLocation: {
    lat: number;
    lng: number;
  };
}

export interface DeliveryInTransitEvent {
  deliveryId: string;
  orderId: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  updatedAt: string;
}

export interface DeliveryCompletedEvent {
  deliveryId: string;
  orderId: string;
  completedAt: string;
  deliveryLocation: {
    lat: number;
    lng: number;
  };
}

export interface DeliveryFailedEvent {
  deliveryId: string;
  orderId: string;
  reason: string;
  failedAt: string;
}
