import { Router } from 'express';
import { getInventory } from '../controllers/inventory.controller';

const router = Router();

router.get('/:productId', getInventory);

export default router;
