import { Router } from 'express';
import { createOrder, getOrders, getOrder, cancelOrder } from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/:id/cancel', cancelOrder);

export default router;
