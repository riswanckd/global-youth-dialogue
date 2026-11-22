import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getPublicKey, registerPushSubscription, dismissNotificationPrompt } from '../controllers/broadcastController';

const router = Router();

router.get('/vapid-public-key', getPublicKey);
router.post('/subscribe', authenticate, registerPushSubscription);
router.patch('/dismiss-prompt', authenticate, dismissNotificationPrompt);

export default router;
