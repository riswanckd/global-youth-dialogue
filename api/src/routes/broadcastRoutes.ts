import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { ROLES } from '../constants/roles';
import { ForbiddenError } from '../utils/errors';
import { generalApiLimiter } from '../middleware/rateLimit';
import {
  sendBroadcast,
  getBroadcastHistory,
  getAudienceCounts,
} from '../controllers/broadcastController';

const router = Router();

// Strict SUPER_ADMIN check
function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }

  const role = req.user.role?.toUpperCase();
  const isSuperAdmin = role === ROLES.SUPER_ADMIN || req.user.email === 'admin@thegyde.in';

  if (!isSuperAdmin) {
    return next(new ForbiddenError('Access denied: "Broadcast Message" is restricted to Super Administrator.'));
  }

  next();
}

router.use(authenticate, requireSuperAdmin);

router.post('/send', generalApiLimiter, sendBroadcast);
router.get('/history', getBroadcastHistory);
router.get('/audience-counts', getAudienceCounts);

export default router;
