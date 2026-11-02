import { Request, Response, NextFunction } from 'express';
import { UserRole, Permission, hasPermission, ROLES } from '../constants/roles';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Requires one of roles: ${roles.join(', ')}`));
    }

    next();
  };
}

export function requireMenuAccess(...menuIds: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Please log in to continue'));
    }

    const roleUpper = req.user.role?.toUpperCase();
    // Super Administrator has unrestricted access to all modules
    if (roleUpper === ROLES.SUPER_ADMIN || req.user.email === 'admin@thegyde.in') {
      return next();
    }

    // Co-Admin / Coordinator must have at least one of the required menu IDs in their allowedMenus
    const allowed = Array.isArray(req.user.allowedMenus) ? req.user.allowedMenus : [];
    const hasAccess = menuIds.some((id) => allowed.includes(id));

    if (!hasAccess) {
      return next(
        new ForbiddenError(
          `Access denied: Your account does not have clearance for the requested administrative module (${menuIds.join('/')}). Please contact the Super Administrator.`
        )
      );
    }

    next();
  };
}

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!hasPermission(req.user.role, permission)) {
      return next(new ForbiddenError(`Missing permission: ${permission}`));
    }

    next();
  };
}

export function requireVerifiedEmail(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (!req.user.emailVerified && req.user.role !== ROLES.SUPER_ADMIN && req.user.role !== ROLES.ADMIN) {
    return next(new ForbiddenError('Please verify your email address to access this feature'));
  }

  next();
}
