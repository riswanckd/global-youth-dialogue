import { Router } from 'express';
import * as publicationController from '../controllers/publicationController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { ROLES } from '../constants/roles';
import { createPublicationSchema, updatePublicationSchema } from '../validators';

const router = Router();

router.get('/', optionalAuthenticate, publicationController.listPublications);
router.get('/:slug', optionalAuthenticate, publicationController.getPublicationBySlug);

// Presenter, coordinator & admin publication submission (Members have read-only access)
router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR, ROLES.PRESENTER),
  validate(createPublicationSchema),
  publicationController.createPublication
);

router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validate(updatePublicationSchema),
  publicationController.updatePublication
);

router.patch(
  '/:id/status',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  publicationController.updatePublication
);

router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  publicationController.deletePublication
);

export default router;
