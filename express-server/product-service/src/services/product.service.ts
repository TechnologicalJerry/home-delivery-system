import { PrismaClient } from '@prisma/client';
import { ProductCache, CachedProduct } from '../cache/product.cache';
import { createLogger } from '@home-delivery/shared';

const logger = createLogger('product-service');
const prisma = new PrismaClient();
const productCache = new ProductCache();

export class ProductService {
  // Get all products (cached catalog)
  async getProducts(category?: string): Promise<CachedProduct[]> {
    // Try cache first
    let products = await productCache.getCatalog();

    if (!products) {
      // Cache miss - fetch from DB
      const dbProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          ...(category && { category }),
        },
        orderBy: { createdAt: 'desc' },
      });

      products = dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl || undefined,
        isActive: p.isActive,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));

      // Cache catalog
      await productCache.setCatalog(products);
    }

    // Filter by category if needed (after cache retrieval)
    if (category && products) {
      products = products.filter(p => p.category === category);
    }

    return products || [];
  }

  // Get single product
  async getProduct(productId: string): Promise<CachedProduct | null> {
    // Try cache first
    let product = await productCache.getProduct(productId);

    if (!product) {
      // Cache miss - fetch from DB
      const dbProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!dbProduct) {
        return null;
      }

      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description || undefined,
        category: dbProduct.category,
        price: dbProduct.price,
        imageUrl: dbProduct.imageUrl || undefined,
        isActive: dbProduct.isActive,
        createdAt: dbProduct.createdAt.toISOString(),
        updatedAt: dbProduct.updatedAt.toISOString(),
      };

      // Cache product
      await productCache.setProduct(product);
    }

    return product;
  }
}
