import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getPublicKey, registerPushSubscription } from '../controllers/broadcastController';

const router = Router();

router.get('/vapid-public-key', getPublicKey);
router.post('/subscribe', authenticate, registerPushSubscription);

export default router;
