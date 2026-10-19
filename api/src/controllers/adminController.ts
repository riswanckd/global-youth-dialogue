import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Application } from '../models/Application';
import { DialogueSession } from '../models/DialogueSession';
import { Topic } from '../models/Topic';
import { Publication } from '../models/Publication';
import { AuditLog } from '../models/AuditLog';
import { sendSuccess } from '../utils/response';
import { ROLES } from '../constants/roles';

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [
      totalMembers,
      activePresenters,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      upcomingSessions,
      completedSessions,
      topicsInReview,
      publishedPapers,
      recentActivity,
      applicationsByCountryRaw,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.MEMBER }),
      User.countDocuments({ role: ROLES.PRESENTER }),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
      DialogueSession.countDocuments({ status: { $in: ['scheduled', 'live'] } }),
      DialogueSession.countDocuments({ status: 'completed' }),
      Topic.countDocuments({ status: { $in: ['proposed', 'reviewing', 'shortlisted'] } }),
      Publication.countDocuments({ status: 'published' }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10),
      Application.aggregate([
        { $match: { country: { $exists: true, $ne: '' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

    const applicationsByCountry = applicationsByCountryRaw.map((item) => ({
      country: item._id,
      count: item.count,
    }));

    // Aggregate real monthly session metrics
    const sessionsTrendRaw = await DialogueSession.aggregate([
      { $match: { scheduledAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$scheduledAt' } },
          count: { $sum: 1 },
        },
      },
      { $limit: 6 },
    ]).catch(() => []);

    const sessionsTrend = sessionsTrendRaw.map((s: any) => ({
      month: s._id || 'Session',
      count: s.count || 0,
    }));

    return sendSuccess(res, {
      totalMembers,
      activePresenters,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      upcomingSessions,
      completedSessions,
      topicsInReview,
      publishedPapers,
      recentActivity,
      applicationsByCountry,
      sessionsTrend,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const targetType = req.query.targetType as string;

    const query: any = {};
    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccess(res, logs, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function purgeTrialData(_req: Request, res: Response, next: NextFunction) {
  try {
    // Delete all users except Super Administrator(s)
    const deleteResult = await User.deleteMany({
      role: { $ne: ROLES.SUPER_ADMIN },
      email: { $nin: ['admin@thegyde.in', '3681mubashircp@gmail.com'] },
    });

    await Application.deleteMany({});
    await Topic.deleteMany({});
    await DialogueSession.deleteMany({});
    await Publication.deleteMany({});

    return sendSuccess(
      res,
      { deletedUsers: deleteResult.deletedCount },
      'All trial records, test users, and demo data have been permanently wiped from the database.'
    );
  } catch (err) {
    next(err);
  }
}
