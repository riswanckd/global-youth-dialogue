import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Broadcast, BroadcastAudience } from '../models/Broadcast';
import { NoticeReadReceipt } from '../models/NoticeReadReceipt';
import { PushSubscription } from '../models/PushSubscription';
import { User } from '../models/User';
import { sendEmail } from '../config/email';
import { sendPushNotificationToUsers, getVapidPublicKey } from '../utils/pushService';
import { ROLES } from '../constants/roles';

function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Builds a clean, branded, personalized GYDE HTML email template
 */
function buildBroadcastEmailHtml(firstName: string, subject: string, message: string): string {
  const paragraphs = message
    .split('\n\n')
    .map(
      (p) =>
        `<p style="margin: 0 0 16px; line-height: 1.6; color: #334155; font-size: 14px;">${p.replace(/\n/g, '<br/>')}</p>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0E4D3C; padding: 32px 36px; text-align: left;">
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(230, 200, 117, 0.2); color: #E6C875; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px;">
                Official Announcement
              </span>
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; line-height: 1.3;">
                ${subject}
              </h1>
              <p style="margin: 6px 0 0; color: #a7f3d0; font-size: 12px;">
                Global Youth Dialogue & Exchange (GYDE) Secretariat
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 36px; color: #1e293b;">
              <p style="margin: 0 0 20px; font-size: 16px; font-weight: 600; color: #0E4D3C;">
                Hi ${firstName},
              </p>
              ${paragraphs}

              <div style="margin: 32px 0 16px; text-align: center;">
                <a href="https://thegyde.in/portal/notices" style="display: inline-block; background-color: #0E4D3C; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 600; font-size: 13px;">
                  View on In-App Notice Board &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 36px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.5;">
                This is a confidential, direct communication dispatched to your official GYDE account.<br/>
                &copy; 2026 Global Youth Dialogue & Exchange (thegyde.in). All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Helper to get role query for target audience
 */
function getAudienceFilter(audience: BroadcastAudience) {
  switch (audience) {
    case 'MEMBERS':
      return { role: { $in: [ROLES.MEMBER, 'member'] } };
    case 'PRESENTERS':
      return { role: { $in: [ROLES.PRESENTER, 'presenter'] } };
    case 'CO_ADMINS':
      return { role: { $in: [ROLES.COORDINATOR, 'coordinator', ROLES.ADMIN, 'admin'] } };
    case 'ALL':
    default:
      return {};
  }
}

/**
 * POST /api/admin/broadcast/send
 * Strictly Super Admin: Dispatches triple-channel broadcast
 */
export async function sendBroadcast(req: Request, res: Response) {
  try {
    const adminUser = req.user!;
    const { subject, message, targetAudience = 'ALL', targetUserIds } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Broadcast subject is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Broadcast message body is required' });
    }

    const audience = (targetAudience || 'ALL').toUpperCase() as BroadcastAudience;
    if (!['ALL', 'MEMBERS', 'PRESENTERS', 'CO_ADMINS', 'SPECIFIC_USERS'].includes(audience)) {
      return res.status(400).json({ success: false, error: 'Invalid target audience selection' });
    }

    const sanitizedSubject = sanitizeText(subject);
    const sanitizedMessage = sanitizeText(message);

    // 1. Query target users
    let recipients: Array<{ _id: mongoose.Types.ObjectId; name: string; email: string; role: string }> = [];

    if (audience === 'SPECIFIC_USERS') {
      if (!Array.isArray(targetUserIds) || targetUserIds.length === 0) {
        return res.status(400).json({ success: false, error: 'Please select at least 1 user to send the broadcast to.' });
      }
      const validIds = targetUserIds
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
        .map((id: string) => new mongoose.Types.ObjectId(id));

      recipients = (await User.find({
        _id: { $in: validIds },
        status: { $ne: 'disabled' },
      })
        .select('_id name email role')
        .lean()) as any;

      if (recipients.length === 0) {
        return res.status(400).json({ success: false, error: 'No active user accounts found among selected users.' });
      }
    } else {
      const audienceFilter = getAudienceFilter(audience);
      recipients = (await User.find({
        ...audienceFilter,
        status: 'active',
      })
        .select('_id name email role')
        .lean()) as any;
    }

    const totalRecipients = recipients.length;

    // 2. Channel 1: Save In-App Broadcast record
    const broadcast = new Broadcast({
      subject: sanitizedSubject,
      message: sanitizedMessage,
      targetAudience: audience,
      targetUserIds: audience === 'SPECIFIC_USERS' ? recipients.map((r) => r._id) : [],
      sentBy: adminUser._id,
      deliveryStats: {
        totalRecipients,
        emailsSent: 0,
        pushSent: 0,
        inAppCreated: totalRecipients,
      },
    });

    await broadcast.save();

    // 3. Trigger asynchronous background delivery for Channel 2 (Emails) & Channel 3 (Push)
    // Runs asynchronously so the Admin UI receives instant confirmation
    (async () => {
      let emailsSent = 0;
      let pushSent = 0;

      // Channel 2: Personalized Emails (in parallel batches of 5)
      const recipientIds = recipients.map((r) => r._id);
      const batchSize = 5;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map(async (recipient) => {
            if (!recipient.email) return;
            const firstName = recipient.name ? recipient.name.trim().split(' ')[0] : 'Member';
            const html = buildBroadcastEmailHtml(firstName, sanitizedSubject, sanitizedMessage);

            const sent = await sendEmail({
              to: recipient.email,
              subject: `GYDE: ${sanitizedSubject}`,
              text: `Hi ${firstName},\n\n${sanitizedMessage}\n\nView online: https://thegyde.in/portal/notices`,
              html,
            });

            if (sent) emailsSent++;
          })
        );
      }

      // Channel 3: Web Push Notifications
      try {
        pushSent = await sendPushNotificationToUsers(recipientIds, {
          title: `GYDE: ${sanitizedSubject}`,
          body: sanitizedMessage.slice(0, 120) + (sanitizedMessage.length > 120 ? '...' : ''),
          url: '/portal/notices',
          tag: `notice-${broadcast._id}`,
        });
      } catch {}

      // Update final delivery stats on broadcast record
      await Broadcast.findByIdAndUpdate(broadcast._id, {
        $set: {
          'deliveryStats.emailsSent': emailsSent,
          'deliveryStats.pushSent': pushSent,
        },
      });
    })().catch(() => {});

    res.status(201).json({
      success: true,
      data: {
        id: broadcast._id.toString(),
        subject: broadcast.subject,
        targetAudience: broadcast.targetAudience,
        totalRecipients,
        createdAt: broadcast.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to dispatch broadcast' });
  }
}

/**
 * GET /api/admin/broadcast/history
 * Strictly Super Admin: Returns list of past broadcasts
 */
export async function getBroadcastHistory(req: Request, res: Response) {
  try {
    const broadcasts = await Broadcast.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formatted = broadcasts.map((b) => ({
      id: b._id.toString(),
      subject: b.subject,
      message: b.message,
      targetAudience: b.targetAudience,
      deliveryStats: b.deliveryStats,
      createdAt: b.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch broadcast history' });
  }
}

/**
 * GET /api/admin/broadcast/audience-counts
 * Strictly Super Admin: Returns live recipient counts per audience segment
 */
export async function getAudienceCounts(_req: Request, res: Response) {
  try {
    const [allCount, membersCount, presentersCount, coAdminsCount] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ role: { $in: [ROLES.MEMBER, 'member'] }, status: 'active' }),
      User.countDocuments({ role: { $in: [ROLES.PRESENTER, 'presenter'] }, status: 'active' }),
      User.countDocuments({
        role: { $in: [ROLES.COORDINATOR, 'coordinator', ROLES.ADMIN, 'admin'] },
        status: 'active',
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ALL: allCount,
        MEMBERS: membersCount,
        PRESENTERS: presentersCount,
        CO_ADMINS: coAdminsCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to get audience counts' });
  }
}

/**
 * GET /api/admin/broadcast/users
 * Strictly Super Admin: Returns list of active delegates/users to select as specific recipients
 */
export async function getBroadcastUsers(req: Request, res: Response) {
  try {
    const search = String(req.query.search || '').trim();
    const query: any = { status: { $ne: 'disabled' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('_id name email role country avatar flag')
      .sort({ name: 1 })
      .limit(500)
      .lean();

    const formatted = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      country: u.country || '',
      avatar: u.avatar || '',
      flag: (u as any).flag || '',
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch users list' });
  }
}

/**
 * GET /api/notices
 * Notice Board: Returns broadcasts applicable to authenticated user's role or directly targeted to them
 */
export async function getNotices(req: Request, res: Response) {
  try {
    const user = req.user!;
    const roleUpper = user.role?.toUpperCase();

    // Map role to target audiences the user is eligible to receive
    let applicableAudiences: BroadcastAudience[] = ['ALL'];

    if (roleUpper === ROLES.MEMBER) {
      applicableAudiences.push('MEMBERS');
    } else if (roleUpper === ROLES.PRESENTER) {
      applicableAudiences.push('PRESENTERS');
    } else if (
      roleUpper === ROLES.COORDINATOR ||
      roleUpper === ROLES.ADMIN ||
      roleUpper === ROLES.SUPER_ADMIN
    ) {
      applicableAudiences.push('CO_ADMINS', 'MEMBERS', 'PRESENTERS');
    }

    // Query notices matching audience OR specifically addressed to this user
    const notices = await Broadcast.find({
      $or: [
        { targetAudience: { $in: applicableAudiences } },
        { targetAudience: 'SPECIFIC_USERS', targetUserIds: user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    // Query read receipts for this user
    const noticeIds = notices.map((n) => n._id);
    const readReceipts = await NoticeReadReceipt.find({
      userId: user._id,
      noticeId: { $in: noticeIds },
    })
      .select('noticeId')
      .lean();

    const readSet = new Set(readReceipts.map((r) => r.noticeId.toString()));

    const formattedNotices = notices.map((n) => ({
      id: n._id.toString(),
      subject: n.subject,
      message: n.message,
      targetAudience: n.targetAudience,
      createdAt: n.createdAt,
      isRead: readSet.has(n._id.toString()),
    }));

    const unreadCount = formattedNotices.filter((n) => !n.isRead).length;

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.status(200).json({
      success: true,
      data: {
        notices: formattedNotices,
        unreadCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch notices' });
  }
}

/**
 * POST /api/notices/mark-all-read
 * Marks all applicable notices as read for current user
 */
export async function markAllNoticesRead(req: Request, res: Response) {
  try {
    const user = req.user!;
    const roleUpper = user.role?.toUpperCase();

    let applicableAudiences: BroadcastAudience[] = ['ALL'];
    if (roleUpper === ROLES.MEMBER) applicableAudiences.push('MEMBERS');
    else if (roleUpper === ROLES.PRESENTER) applicableAudiences.push('PRESENTERS');
    else applicableAudiences.push('CO_ADMINS', 'MEMBERS', 'PRESENTERS');

    const notices = await Broadcast.find({
      $or: [
        { targetAudience: { $in: applicableAudiences } },
        { targetAudience: 'SPECIFIC_USERS', targetUserIds: user._id },
      ],
    })
      .select('_id')
      .lean();

    const operations = notices.map((n) => ({
      updateOne: {
        filter: { noticeId: n._id, userId: user._id },
        update: { $setOnInsert: { noticeId: n._id, userId: user._id, readAt: new Date() } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await NoticeReadReceipt.bulkWrite(operations, { ordered: false }).catch(() => {});
    }

    res.status(200).json({ success: true, message: 'All notices marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to mark notices as read' });
  }
}

/**
 * POST /api/notices/:id/read
 * Marks a single notice as read for current user
 */
export async function markNoticeRead(req: Request, res: Response) {
  try {
    const user = req.user!;
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid notice ID' });
    }

    await NoticeReadReceipt.updateOne(
      { noticeId: new mongoose.Types.ObjectId(id), userId: user._id },
      { $setOnInsert: { noticeId: new mongoose.Types.ObjectId(id), userId: user._id, readAt: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to mark notice as read' });
  }
}

/**
 * GET /api/push/vapid-public-key
 * Returns VAPID public key for browser service worker subscription
 */
export async function getPublicKey(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      publicKey: getVapidPublicKey(),
    },
  });
}

/**
 * POST /api/push/subscribe
 * Registers or updates a user's browser push subscription
 */
export async function registerPushSubscription(req: Request, res: Response) {
  try {
    const user = req.user!;
    const { endpoint, keys, userAgent } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ success: false, error: 'Invalid push subscription payload' });
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        userId: user._id,
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
        userAgent: userAgent || req.headers['user-agent'] || '',
      },
      { upsert: true, new: true }
    );

    // Persist resolution server-side on User model (Zero browser storage)
    await User.findByIdAndUpdate(user._id, { $set: { hasDismissedNotificationPrompt: true } });

    res.status(200).json({ success: true, message: 'Push subscription registered successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to register push subscription' });
  }
}

/**
 * PATCH /api/push/dismiss-prompt
 * Records user preference to block/dismiss notification prompt server-side
 */
export async function dismissNotificationPrompt(req: Request, res: Response) {
  try {
    const user = req.user!;
    await User.findByIdAndUpdate(user._id, { $set: { hasDismissedNotificationPrompt: true } });
    res.status(200).json({ success: true, message: 'Notification prompt dismissed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to dismiss notification prompt' });
  }
}
