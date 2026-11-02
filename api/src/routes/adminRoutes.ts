import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireRole, requireMenuAccess } from '../middleware/rbac';
import { ROLES } from '../constants/roles';
import userRoutes from './userRoutes';
import applicationRoutes from './applicationRoutes';
import topicRoutes from './topicRoutes';
import sessionRoutes from './sessionRoutes';
import publicationRoutes from './publicationRoutes';
import feedbackRoutes from './feedbackRoutes';

const router = Router();

router.use(authenticate);
router.use(requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN));

// Dynamic Navigation & Clearance Verification Endpoint (Server-Side RBAC)
router.get('/navigation', adminController.getNavigationMenu);

router.get('/dashboard/stats', requireMenuAccess('dashboard'), adminController.getDashboardStats);
router.get('/audit-logs', requireRole(ROLES.SUPER_ADMIN), adminController.getAuditLogs);
router.delete('/trial-data', requireRole(ROLES.SUPER_ADMIN), adminController.purgeTrialData);
router.post('/trial-data', requireRole(ROLES.SUPER_ADMIN), adminController.purgeTrialData);

// Mount resource routers under /admin with granular server-side RBAC
router.use('/users', requireMenuAccess('users'), userRoutes);
router.use('/applications', requireMenuAccess('applications'), applicationRoutes);
router.use('/topics', requireMenuAccess('topics', 'pipeline'), topicRoutes);
router.use('/sessions', requireMenuAccess('sessions', 'session-summaries'), sessionRoutes);
router.use('/publications', requireMenuAccess('publications'), publicationRoutes);
router.use('/feedback', requireMenuAccess('feedback'), feedbackRoutes);

export default router;

