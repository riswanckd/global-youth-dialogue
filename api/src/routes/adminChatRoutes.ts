import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { chatMessageLimiter } from '../middleware/rateLimit';
import { ROLES } from '../constants/roles';
import { ForbiddenError } from '../utils/errors';
import {
  getAdminConversations,
  getAdminConversationMessages,
  sendAdminReply,
} from '../controllers/adminChatController';

const router = Router();

// Strict SUPER_ADMIN check middleware
function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }

  const role = req.user.role?.toUpperCase();
  const isSuperAdmin = role === ROLES.SUPER_ADMIN || req.user.email === 'admin@thegyde.in';

  if (!isSuperAdmin) {
    return next(
      new ForbiddenError('Access denied: "Chat with Community" is restricted strictly to the Super Administrator.')
    );
  }

  next();
}

router.use(authenticate, requireSuperAdmin);

router.get('/conversations', getAdminConversations);
router.get('/messages/:userId', getAdminConversationMessages);
router.post('/reply/:userId', chatMessageLimiter, sendAdminReply);

export default router;
