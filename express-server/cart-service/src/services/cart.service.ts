import { CartRepository, Cart, CartItem } from '../redis/cart.repository';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('cart-service');
const cartRepo = new CartRepository();

export class CartService {
  async getCart(userId: string): Promise<Cart | null> {
    return await cartRepo.getCart(userId);
  }

  async addItem(userId: string, item: CartItem): Promise<Cart> {
    let cart = await cartRepo.getCart(userId);

    if (!cart) {
      cart = {
        userId,
        items: [],
        total: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    // Check if item already exists
    const existingIndex = cart.items.findIndex(
      i => i.productId === item.productId
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    cart.updatedAt = new Date().toISOString();

    await cartRepo.saveCart(cart);
    logger.info('Item added to cart', { userId, productId: item.productId });

    return cart;
  }

  async updateItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
    const cart = await cartRepo.getCart(userId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(i => i.productId === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId !== itemId);
    } else {
      item.quantity = quantity;
    }

    cart.total = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    cart.updatedAt = new Date().toISOString();

    await cartRepo.saveCart(cart);
    logger.info('Cart item updated', { userId, itemId });

    return cart;
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await cartRepo.getCart(userId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(i => i.productId !== itemId);
    cart.total = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    cart.updatedAt = new Date().toISOString();

    await cartRepo.saveCart(cart);
    logger.info('Item removed from cart', { userId, itemId });

    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    await cartRepo.deleteCart(userId);
    logger.info('Cart cleared', { userId });
  }
}
