// Inventory-related event contracts
export enum InventoryEventType {
  INVENTORY_UPDATED = 'inventory.updated',
  INVENTORY_LOW_STOCK = 'inventory.low_stock',
  INVENTORY_OUT_OF_STOCK = 'inventory.out_of_stock',
}

export interface InventoryUpdatedEvent {
  productId: string;
  quantity: number;
  previousQuantity: number;
  updatedAt: string;
}

export interface InventoryLowStockEvent {
  productId: string;
  currentQuantity: number;
  threshold: number;
  alertedAt: string;
}

export interface InventoryOutOfStockEvent {
  productId: string;
  alertedAt: string;
}
