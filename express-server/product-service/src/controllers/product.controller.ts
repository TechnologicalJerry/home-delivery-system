import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const products = await productService.getProducts(category);

    res.json({
      success: true,
      data: products,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to get products',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: product,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to get product',
      },
      timestamp: new Date().toISOString(),
    });
  }
};
