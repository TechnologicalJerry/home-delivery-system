import { Router } from 'express';
import { trackDelivery } from '../controllers/delivery.controller';

const router = Router();

router.get('/:orderId/track', trackDelivery);

export default router;
