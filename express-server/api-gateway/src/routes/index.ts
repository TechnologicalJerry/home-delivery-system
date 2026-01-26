import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { HttpClient } from '../utils/http-client';
import { config } from '../config';

const router = Router();

// Initialize HTTP clients for each service
const authClient = new HttpClient(config.services.auth);
const userClient = new HttpClient(config.services.user);
const productClient = new HttpClient(config.services.product);
const inventoryClient = new HttpClient(config.services.inventory);
const cartClient = new HttpClient(config.services.cart);
const orderClient = new HttpClient(config.services.order);
const paymentClient = new HttpClient(config.services.payment);
const deliveryClient = new HttpClient(config.services.delivery);

// Helper to forward request with auth headers
const forwardRequest = async (
  client: HttpClient,
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  req: Request,
  res: Response
) => {
  try {
    const headers: Record<string, string> = {};
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }
    if ((req as AuthRequest).user?.userId) {
      headers['x-user-id'] = (req as AuthRequest).user!.userId;
    }

    let data: any;
    if (method === 'get' || method === 'delete') {
      data = await client[method](path, headers);
    } else {
      data = await client[method](path, req.body, headers);
    }

    res.json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code: 'SERVICE_ERROR',
        message: error.message || 'Service error',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// Auth routes (no auth required)
router.post('/auth/register', (req, res) => forwardRequest(authClient, 'post', '/auth/register', req, res));
router.post('/auth/login', (req, res) => forwardRequest(authClient, 'post', '/auth/login', req, res));
router.post('/auth/refresh', (req, res) => forwardRequest(authClient, 'post', '/auth/refresh', req, res));

// User routes (auth required)
router.get('/users/profile', authMiddleware, (req, res) => forwardRequest(userClient, 'get', '/users/profile', req, res));
router.put('/users/profile', authMiddleware, (req, res) => forwardRequest(userClient, 'put', '/users/profile', req, res));

// Product routes (public)
router.get('/products', (req, res) => forwardRequest(productClient, 'get', '/products', req, res));
router.get('/products/:id', (req, res) => forwardRequest(productClient, 'get', `/products/${req.params.id}`, req, res));

// Inventory routes (public for availability)
router.get('/inventory/:productId', (req, res) => forwardRequest(inventoryClient, 'get', `/inventory/${req.params.productId}`, req, res));

// Cart routes (auth required)
router.get('/cart', authMiddleware, (req, res) => forwardRequest(cartClient, 'get', '/cart', req, res));
router.post('/cart/items', authMiddleware, (req, res) => forwardRequest(cartClient, 'post', '/cart/items', req, res));
router.put('/cart/items/:itemId', authMiddleware, (req, res) => forwardRequest(cartClient, 'put', `/cart/items/${req.params.itemId}`, req, res));
router.delete('/cart/items/:itemId', authMiddleware, (req, res) => forwardRequest(cartClient, 'delete', `/cart/items/${req.params.itemId}`, req, res));
router.delete('/cart', authMiddleware, (req, res) => forwardRequest(cartClient, 'delete', '/cart', req, res));

// Order routes (auth required)
router.post('/orders', authMiddleware, (req, res) => forwardRequest(orderClient, 'post', '/orders', req, res));
router.get('/orders', authMiddleware, (req, res) => forwardRequest(orderClient, 'get', '/orders', req, res));
router.get('/orders/:id', authMiddleware, (req, res) => forwardRequest(orderClient, 'get', `/orders/${req.params.id}`, req, res));
router.post('/orders/:id/cancel', authMiddleware, (req, res) => forwardRequest(orderClient, 'post', `/orders/${req.params.id}/cancel`, req, res));

// Payment routes (auth required)
router.post('/payments', authMiddleware, (req, res) => forwardRequest(paymentClient, 'post', '/payments', req, res));
router.get('/payments/:id', authMiddleware, (req, res) => forwardRequest(paymentClient, 'get', `/payments/${req.params.id}`, req, res));

// Delivery routes (auth required)
router.get('/deliveries/:orderId/track', authMiddleware, (req, res) => forwardRequest(deliveryClient, 'get', `/deliveries/${req.params.orderId}/track`, req, res));

export default router;
