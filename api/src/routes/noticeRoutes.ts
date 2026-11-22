import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getNotices,
  markAllNoticesRead,
  markNoticeRead,
} from '../controllers/broadcastController';

const router = Router();

router.use(authenticate);

router.get('/', getNotices);
router.post('/mark-all-read', markAllNoticesRead);
router.post('/:id/read', markNoticeRead);

export default router;
