import { Router } from 'express';
import { createPayment, getPayment, handleWebhook } from '../controllers/payment.controller';

const router = Router();

router.post('/', createPayment);
router.get('/:id', getPayment);
router.post('/webhooks/stripe', handleWebhook);

export default router;
