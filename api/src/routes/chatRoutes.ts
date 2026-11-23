import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { chatMessageLimiter } from '../middleware/rateLimit';
import {
  getMemberMessages,
  sendMemberMessage,
  markSpotlightSeen,
  getMediaStream,
  markMemberMessagesRead,
} from '../controllers/chatController';

const router = Router();

// Member and Presenter Chat endpoints
router.get('/messages', authenticate, getMemberMessages);
router.post('/mark-read', authenticate, markMemberMessagesRead);
router.post('/send', authenticate, chatMessageLimiter, sendMemberMessage);
router.patch('/spotlight-seen', authenticate, markSpotlightSeen);
router.get('/media/:messageId', authenticate, getMediaStream);

export default router;
