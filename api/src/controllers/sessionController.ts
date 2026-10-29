import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { DialogueSession } from '../models/DialogueSession';
import { Topic } from '../models/Topic';
import { sendSuccess } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { ROLES } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

export async function listSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = {};
    const userRole = (req.user?.role || '').toLowerCase();
    const isStaff = ['admin', 'super_admin', 'coordinator'].includes(userRole);
    const publicStatuses = ['scheduled', 'approved', 'live', 'completed', 'published'];

    if (!isStaff) {
      if (req.user) {
        // Authenticated users see public sessions OR their own proposed sessions
        if (status && status !== 'all') {
          query.$and = [
            { status },
            { $or: [{ status: { $in: publicStatuses } }, { createdBy: req.user._id }] },
          ];
        } else {
          query.$or = [{ status: { $in: publicStatuses } }, { createdBy: req.user._id }];
        }
      } else {
        // Public unauthenticated visitors see only scheduled, live, and completed sessions
        if (status && status !== 'all') {
          query.status = publicStatuses.includes(status) ? status : { $in: [] };
        } else {
          query.status = { $in: publicStatuses };
        }
      }
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') query.category = category;
    if (search) {
      const searchCond = [
        { title: { $regex: search, $options: 'i' } },
        { motion: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = (query.$and || []).concat([{ $or: query.$or }, { $or: searchCond }]);
        delete query.$or;
      } else {
        query.$or = searchCond;
      }
    }

    const total = await DialogueSession.countDocuments(query);
    const sessions = await DialogueSession.find(query)
      .populate('assignedCoordinator', 'name email role')
      .sort({ scheduledAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const isMemberOrStaff = !!req.user;

    // Secure sensitive meeting links and private recordings from unauthorized public visitors
    const sanitized = sessions.map((s) => {
      const obj = s.toJSON();
      if (!isMemberOrStaff) {
        delete (obj as any).meetingUrl;
        if (obj.recordingVisibility !== 'public') {
          delete (obj as any).recordingUrl;
        }
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

export async function getSessionById(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await DialogueSession.findById(req.params.id)
      .populate('assignedCoordinator', 'name email role');
    if (!session) throw new NotFoundError('Session not found');

    const obj = session.toJSON();
    const isMemberOrStaff = !!req.user;

    if (!isMemberOrStaff) {
      delete (obj as any).meetingUrl;
      if (obj.recordingVisibility !== 'public') {
        delete (obj as any).recordingUrl;
      }
    }

    return sendSuccess(res, obj);
  } catch (err) {
    next(err);
  }
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    const isStaff = ['admin', 'super_admin', 'coordinator'].includes(userRole);
    const sessionStatus = isStaff ? (req.body.status || 'scheduled') : 'proposed';

    // Auto-populate motion from matching topic in topic bank if not explicitly provided
    let motion = req.body.motion?.trim() || '';
    if (!motion && req.body.title) {
      const cleanTitle = req.body.title.trim();
      const linkedTopic = await Topic.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') } },
          { slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
        ],
      });
      if (linkedTopic?.motion) {
        motion = linkedTopic.motion;
      }
    }

    const session = await DialogueSession.create({
      ...req.body,
      motion,
      status: sessionStatus,
      isPresenterProposal: !isStaff,
      createdBy: req.user!._id,
    });

    await logAuditEvent({
      action: 'SESSION_CREATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'session',
      targetId: session._id.toString(),
      details: { title: session.title, scheduledAt: session.scheduledAt },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await triggerCacheRevalidation(['/', '/sessions']);

    return sendSuccess(res, session, 'Session scheduled successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    let session = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      session = await DialogueSession.findById(rawId);
    }
    if (!session && req.body.title) {
      session = await DialogueSession.findOne({ title: req.body.title });
    }
    if (!session) throw new NotFoundError('Session not found');

    const userRole = (req.user?.role || '').toLowerCase();
    const isStaffAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isCoordinator = userRole === 'coordinator';

    // Verify coordinator access
    if (isCoordinator && !isStaffAdmin) {
      const isAssigned =
        session.assignedCoordinator &&
        session.assignedCoordinator.toString() === req.user?._id.toString();
      const isCreator =
        session.createdBy &&
        session.createdBy.toString() === req.user?._id.toString();
      const isUnassigned = !session.assignedCoordinator;

      if (!isAssigned && !isCreator && !isUnassigned) {
        throw new ForbiddenError('You can only edit sessions assigned to you or created by you.');
      }
    }

    const updateData = { ...req.body };
    if (updateData.assignedCoordinatorId && isStaffAdmin) {
      updateData.assignedCoordinator = updateData.assignedCoordinatorId;
      delete updateData.assignedCoordinatorId;
    }
    if (['scheduled', 'approved', 'published', 'live'].includes(updateData.status)) {
      updateData.isPresenterProposal = false;
    }

    // If motion is empty or missing, check if linked topic has a motion
    if (!updateData.motion && !session.motion) {
      const cleanTitle = (updateData.title || session.title).trim();
      const linkedTopic = await Topic.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') } },
          { slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
        ],
      });
      if (linkedTopic?.motion) {
        updateData.motion = linkedTopic.motion;
      }
    }

    Object.assign(session, updateData);
    if (['scheduled', 'approved', 'published', 'live'].includes(session.status)) {
      session.isPresenterProposal = false;
    }
    await session.save();

    await logAuditEvent({
      action: 'SESSION_UPDATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'session',
      targetId: session._id.toString(),
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await triggerCacheRevalidation(['/', '/sessions']);

    return sendSuccess(res, session, 'Session updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = (Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || '')) as string;
    let session: any = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      session = await DialogueSession.findByIdAndDelete(rawId);
    }
    if (!session) {
      session = await DialogueSession.findOneAndDelete({
        $or: [{ id: rawId }, { title: rawId }],
      });
    }

    if (!session) throw new NotFoundError('Session not found');

    await logAuditEvent({
      action: 'SESSION_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'session',
      targetId: session._id.toString(),
      details: { title: session.title, category: session.category },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await triggerCacheRevalidation(['/', '/sessions']);

    return sendSuccess(res, null, 'Session deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function triggerCacheRevalidation(paths: string[] = ['/', '/sessions']) {
  const revalidateUrl = process.env.VERCEL_REVALIDATE_URL || process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET || 'gyde_revalidate_secret';
  if (revalidateUrl) {
    try {
      await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
        body: JSON.stringify({ paths, timestamp: Date.now() }),
      });
    } catch {
      // Non-blocking
    }
  }
}

export async function revalidateSessions(req: Request, res: Response, next: NextFunction) {
  try {
    await triggerCacheRevalidation(['/', '/sessions']);
    return sendSuccess(res, { revalidated: true, timestamp: Date.now() }, 'Cache revalidated successfully');
  } catch (err) {
    next(err);
  }
}
