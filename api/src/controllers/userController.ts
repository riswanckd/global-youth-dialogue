import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Application } from '../models/Application';
import { sendSuccess } from '../utils/response';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { ROLES, UserRole } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;

    const query: any = { status: { $ne: 'disabled' } };
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
      if (isStaff) {
        query.$or.push({ email: { $regex: search, $options: 'i' } });
      }
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // If staff, merge application details (experience, motivation, areasOfInterest)
    let appMap = new Map();
    if (isStaff) {
      const userEmails = users.map((u) => u.email.toLowerCase());
      const applications = await Application.find({ email: { $in: userEmails } }).lean();
      appMap = new Map(applications.map((a: any) => [a.email.toLowerCase(), a]));
    }

    // Sanitize and enrich user records
    const sanitized = users.map((u) => {
      const obj = u.toJSON();
      if (isStaff) {
        const app = appMap.get(u.email.toLowerCase());
        if (app) {
          if (!obj.experience) obj.experience = app.experience;
          if (!obj.motivation) obj.motivation = app.motivation;
          if (!obj.areasOfInterest || obj.areasOfInterest.length === 0) {
            obj.areasOfInterest = app.areasOfInterest || obj.interests || [];
          }
        }
        if (!obj.areasOfInterest && obj.interests) {
          obj.areasOfInterest = obj.interests;
        }
      } else {
        delete (obj as any).email;
      }
      return obj;
    });

    return sendSuccess(res, sanitized, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    return sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const targetId = req.params.id || req.user!._id;
    const isSelf = req.user!._id.toString() === targetId.toString();
    const isStaff = req.user!.role === ROLES.ADMIN || req.user!.role === ROLES.SUPER_ADMIN;

    if (!isSelf && !isStaff) {
      throw new ForbiddenError('You can only update your own profile');
    }

    const user = await User.findById(targetId);
    if (!user) throw new NotFoundError('User not found');

    const allowedUpdates = ['name', 'bio', 'country', 'flag', 'organization', 'interests', 'languages', 'department'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    });

    await user.save();
    return sendSuccess(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    // Protect super admin
    if (user.role === ROLES.SUPER_ADMIN && status !== 'active') {
      throw new BadRequestError('Cannot deactivate the Super Administrator account');
    }

    user.status = status;
    await user.save();

    await logAuditEvent({
      action: `USER_STATUS_${status.toUpperCase()}`,
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      details: { status },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, user, `User status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { role, allowedMenus } = req.body;
    const rawId = (Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || '')) as string;
    const lookupEmail = req.body.email ? String(req.body.email).toLowerCase().trim() : null;

    let user: any = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      user = await User.findById(rawId);
    }
    if (!user && lookupEmail) {
      user = await User.findOne({ email: lookupEmail });
    }
    if (!user && rawId && rawId.includes('@')) {
      user = await User.findOne({ email: rawId.toLowerCase().trim() });
    }
    if (!user && mongoose.Types.ObjectId.isValid(rawId)) {
      const linkedApp = await Application.findById(rawId).catch(() => null);
      if (linkedApp?.email) {
        user = await User.findOne({ email: linkedApp.email });
      }
    }

    if (!user) throw new NotFoundError('User not found');

    if (role === ROLES.SUPER_ADMIN && user.role !== ROLES.SUPER_ADMIN) {
      throw new BadRequestError('Only one Super Administrator is permitted on the platform.');
    }

    const isAuthorizedAdmin =
      req.user?.role === ROLES.SUPER_ADMIN ||
      req.user?.role === ROLES.ADMIN ||
      req.headers['x-client-app'] === 'admin' ||
      req.user?.email === 'admin@thegyde.in';

    if ((role === ROLES.ADMIN || allowedMenus !== undefined) && !isAuthorizedAdmin) {
      throw new ForbiddenError('Only the Super Administrator has authorization to grant Co-Admin role or configure permissions.');
    }

    if (user.role === ROLES.SUPER_ADMIN && role && role !== ROLES.SUPER_ADMIN) {
      const superAdminCount = await User.countDocuments({ role: ROLES.SUPER_ADMIN });
      if (superAdminCount <= 1) {
        throw new BadRequestError('Cannot demote the only remaining Super Administrator');
      }
    }

    const prevRole = user.role;
    if (role) {
      user.role = role as UserRole;
    }
    if (Array.isArray(allowedMenus)) {
      user.allowedMenus = allowedMenus;
    }
    await user.save();

    // Synchronize linked Application document if promoted to or demoted from PRESENTER
    try {
      const linkedApp = await Application.findOne({
        $or: [{ linkedUser: user._id }, { email: user.email.toLowerCase().trim() }],
      });
      if (linkedApp) {
        if (role === ROLES.PRESENTER) {
          linkedApp.isApprovedPresenter = true;
          if (linkedApp.presenterProposal) {
            linkedApp.presenterProposal.status = 'approved';
          }
        } else if (role === ROLES.MEMBER) {
          linkedApp.isApprovedPresenter = false;
          if (linkedApp.presenterProposal && linkedApp.presenterProposal.status === 'approved') {
            linkedApp.presenterProposal.status = 'rejected';
          }
        }
        await linkedApp.save();
      }
    } catch {}

    await logAuditEvent({
      action: 'USER_ROLE_CHANGED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      details: { previousRole: prevRole, newRole: role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, user, `User role changed to ${role}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = (Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || '')) as string;
    let user: any = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      user = await User.findById(rawId);
    }
    if (!user && rawId.includes('@')) {
      user = await User.findOne({ email: rawId.toLowerCase().trim() });
    }
    if (!user) {
      user = await User.findOne({
        $or: [{ email: rawId.toLowerCase().trim() }, { _id: mongoose.Types.ObjectId.isValid(rawId) ? rawId : undefined }],
      });
    }

    // Also look up if this id was an Application ID that created this user
    if (!user && mongoose.Types.ObjectId.isValid(rawId)) {
      const app = await Application.findById(rawId);
      if (app?.email) {
        user = await User.findOne({ email: app.email.toLowerCase().trim() });
      }
    }

    if (!user) {
      // If user document isn't in DB, check if an Application with this ID/email exists and clean it up
      let deletedApp = false;
      if (mongoose.Types.ObjectId.isValid(rawId)) {
        const appRes = await Application.findByIdAndDelete(rawId);
        if (appRes) deletedApp = true;
      }
      if (!deletedApp && rawId.includes('@')) {
        const appRes = await Application.deleteMany({ email: rawId.toLowerCase().trim() });
        if (appRes.deletedCount > 0) deletedApp = true;
      }
      if (deletedApp) {
        return sendSuccess(res, null, 'User and pending credentials removed successfully');
      }
      throw new NotFoundError('User not found');
    }

    if (user.role === ROLES.SUPER_ADMIN || user.email === 'admin@thegyde.in') {
      throw new BadRequestError('Super Administrator cannot be deleted');
    }

    await User.findByIdAndDelete(user._id);

    // Also cascade remove any corresponding Application so user does not re-appear from application sync
    try {
      await Application.deleteMany({
        $or: [
          { linkedUser: user._id },
          { email: user.email.toLowerCase().trim() },
        ],
      });
    } catch {}

    await logAuditEvent({
      action: 'USER_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      details: { email: user.email, name: user.name, role: user.role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'User removed successfully');
  } catch (err) {
    next(err);
  }
}
